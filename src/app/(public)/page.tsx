'use client';

import { VideoGrid } from '@/components/ui/video-grid/VideoGrid';
import { VideoFilters } from '@/components/ui/video-filters/VideoFilters';
import { useVideoFilters } from '@/hooks/useVideoFilters';
import type { IVideo } from '@/types/video';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Инициализация фильтров из URL-параметров
  const initialFilters = {
    searchTerm: searchParams.get('search') || '',
    durationFilter: (searchParams.get('duration') as 'all' | '<5' | '5-20' | '>20') || 'all',
    sortBy: (searchParams.get('sort') as 'date' | 'title') || 'date',
  };

  const { filters, setFilters, filteredAndSortedVideos } = useVideoFilters(videos, initialFilters);

  // Обновление URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.searchTerm) {
      params.set('search', filters.searchTerm);
    }
    
    if (filters.durationFilter !== 'all') {
      params.set('duration', filters.durationFilter);
    }
    
    if (filters.sortBy !== 'date') {
      params.set('sort', filters.sortBy);
    }
    
    // Обновление URL без перезагрузки страницы
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">{loading ? 'Загрузка видео...' : 'Видео-каталог'}</h1>
        <VideoFilters
          searchTerm={filters.searchTerm}
          durationFilter={filters.durationFilter}
          sortBy={filters.sortBy}
          onSearchChange={(term) => setFilters(prev => ({ ...prev, searchTerm: term }))}
          onDurationFilterChange={(filter) => setFilters(prev => ({ ...prev, durationFilter: filter }))}
          onSortChange={(sort) => setFilters(prev => ({ ...prev, sortBy: sort }))}
        />
        <VideoGrid videos={filteredAndSortedVideos} isLoading={loading} />
      </div>
    </section>
  );
}
