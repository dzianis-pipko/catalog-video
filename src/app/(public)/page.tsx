'use client';

import { VideoGrid } from '@/components/ui/video-grid/VideoGrid';
import { VideoFilters } from '@/components/ui/video-filters/VideoFilters';
import { useVideoFilters } from '@/hooks/useVideoFilters';
import { useVideoCatalog } from '@/hooks/useVideoCatalog';
import type { IVideo } from '@/types/video';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Инициализация фильтров из URL-параметров
  const initialFilters = {
    searchTerm: searchParams.get('search') || '',
    durationFilter: (searchParams.get('duration') as 'all' | '<5' | '5-20' | '>20') || 'all',
    sortBy: (searchParams.get('sort') as 'date' | 'title') || 'date',
  };

  // Получение видео с помощью TanStack Query
  const {
    data: videos = [],
    isLoading,
    isError,
    refetch
  } = useVideoCatalog(
    initialFilters.searchTerm,
    mapDurationFilter(initialFilters.durationFilter),
    initialFilters.sortBy
  );

  const { filters, setFilters, filteredAndSortedVideos } = useVideoFilters(videos, initialFilters);

  // Функция для сброса фильтров
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      durationFilter: 'all',
      sortBy: 'date',
    });
  };

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

  // Обновление данных при изменении фильтров
  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  // Вспомогательная функция для маппинга фильтров
  function mapDurationFilter(duration: string) {
    switch (duration) {
      case '<5':
        return 'short' as const;
      case '5-20':
        return 'medium' as const;
      case '>20':
        return 'long' as const;
      default:
        return undefined;
    }
  }

  return (
    <section className='py-8 w-full'>
      <div className="w-full max-w-7xl px-4 mx-auto">
        <h1 className="text-3xl font-bold text-white dark:text-text-primary mb-8">{isLoading ? 'Загрузка видео...' : 'Видео-каталог'}</h1>
        <VideoFilters
          searchTerm={filters.searchTerm}
          durationFilter={filters.durationFilter}
          sortBy={filters.sortBy}
          onSearchChange={(term) => setFilters(prev => ({ ...prev, searchTerm: term }))}
          onDurationFilterChange={(filter) => setFilters(prev => ({ ...prev, durationFilter: filter }))}
          onSortChange={(sort) => setFilters(prev => ({ ...prev, sortBy: sort }))}
        />
        <VideoGrid
          videos={filteredAndSortedVideos}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          onResetFilters={resetFilters}
        />
      </div>
    </section>
  );
}
