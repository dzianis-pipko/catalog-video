'use client';

import { useState, useEffect, useMemo } from 'react';
import type { IVideo } from '@/types/video';
import type { TDurationFilter, TSortOption } from '@/types/filter';

interface VideoFilters {
  searchTerm: string;
  durationFilter: TDurationFilter;
  sortBy: TSortOption;
}

export const useVideoFilters = (initialFilters: VideoFilters) => {
  const [filters, setFilters] = useState<VideoFilters>(initialFilters);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialFilters.searchTerm);

  // Дебаунс для поиска
 useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(filters.searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.searchTerm]);

  return {
    filters,
    setFilters,
    debouncedSearchTerm,
  };
};

export const useVideoFiltering = (videos: IVideo[], debouncedSearchTerm: string, filters: { durationFilter: TDurationFilter; sortBy: TSortOption }) => {
  // Фильтрация и сортировка видео с memoization
  const filteredAndSortedVideos = useMemo(() => {
    return videos
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
  }, [videos, debouncedSearchTerm, filters.durationFilter, filters.sortBy]);

  return filteredAndSortedVideos;
};
