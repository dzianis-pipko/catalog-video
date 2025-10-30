'use client';

import { useState, useEffect } from 'react';
import type { IVideo } from '@/types/video';

export type DurationFilter = '<5' | '5-20' | '>20' | 'all';

interface VideoFilters {
 searchTerm: string;
 durationFilter: DurationFilter;
  sortBy: 'date' | 'title';
}

export const useVideoFilters = (videos: IVideo[], initialFilters?: Partial<VideoFilters>) => {
  const [filters, setFilters] = useState<VideoFilters>({
    searchTerm: initialFilters?.searchTerm || '',
    durationFilter: initialFilters?.durationFilter || 'all',
    sortBy: initialFilters?.sortBy || 'date',
  });
  
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Дебаунс для поиска
 useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  // Фильтрация и сортировка видео
  const filteredAndSortedVideos = videos
    .filter(video => {
      // Фильтр по названию
      const matchesSearch = video.title
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());
      
      // Фильтр по длительности
      let matchesDuration = true;
      if (filters.durationFilter !== 'all') {
        const durationInMinutes = video.durationSec / 60;
        switch (filters.durationFilter) {
          case '<5':
            matchesDuration = durationInMinutes < 5;
            break;
          case '5-20':
            matchesDuration = durationInMinutes >= 5 && durationInMinutes <= 20;
            break;
          case '>20':
            matchesDuration = durationInMinutes > 20;
            break;
        }
      }
      
      return matchesSearch && matchesDuration;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'date') {
        // Сортировка по дате (новые сверху)
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      } else {
        // Сортировка по названию
        return a.title.localeCompare(b.title);
      }
    });

  return {
    filters,
    setFilters,
    filteredAndSortedVideos,
    debouncedSearchTerm,
  };
};