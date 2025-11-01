'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { TDurationFilter, TSortOption } from '@/types/filter';

interface SyncFilters {
  searchTerm: string;
  durationFilter: TDurationFilter;
  sortBy: TSortOption;
}

export const useUrlSync = (filters: SyncFilters) => {
  const router = useRouter();
  const hasInitialized = useRef(false);
  
  // Эффект для синхронизации фильтров с URL-параметрами только при монтировании!
  useEffect(() => {
    // Помечаем, что инициализация завершена
    hasInitialized.current = true;
  }, []);

  // Обновление URL при изменении фильтров (только после начальной инициализации)
  useEffect(() => {
    // Пропускаем первую инициализацию
    if (!hasInitialized.current) {
      return;
    }
    
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
};