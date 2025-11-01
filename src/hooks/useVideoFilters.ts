'use client';

import { useState, useEffect, useRef } from 'react';
import type { IVideo } from '@/types/video';
import { useSearchParams, useRouter } from 'next/navigation';
import type { DurationFilter, SortOption } from '@/types/filter';

interface VideoFilters {
 searchTerm: string;
  durationFilter: DurationFilter;
   sortBy: SortOption;
}

export const useVideoFilters = (videos: IVideo[], initialFilters?: Partial<VideoFilters>) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasInitialized = useRef(false);
  
 // Инициализация фильтров из URL или из начальных значений
  const [filters, setFilters] = useState<VideoFilters>(() => {
     // Проверка параметров в URL при начальной загрузке
     // Если есть параметры в URL, используем их, иначе используем серверные начальные значения
     const urlSearch = searchParams?.get('search');
     const urlDuration = searchParams?.get('duration');
     const urlSort = searchParams?.get('sort');
     
     const searchTerm = urlSearch !== null ? urlSearch : initialFilters?.searchTerm || '';
     const durationFilter = urlDuration ? (urlDuration as DurationFilter) : initialFilters?.durationFilter || 'all';
     const sortBy = urlSort ? (urlSort as SortOption) : initialFilters?.sortBy || 'date';
     
     return {
       searchTerm,
       durationFilter,
       sortBy,
     };
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

   return {
     filters,
     setFilters,
     filteredAndSortedVideos,
     debouncedSearchTerm,
   };
};