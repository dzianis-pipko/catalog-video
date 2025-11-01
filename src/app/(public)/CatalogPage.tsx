'use client';

import { VideoFilters } from '@/components/ui/video-filters/VideoFilters';
import { VideoGrid } from '@/components/ui/video-grid/VideoGrid';

import { useVideoCatalog } from '@/hooks/useVideoCatalog';
import { useVideoFilters, useVideoFiltering } from '@/hooks/useVideoFilterLogic';
import { useUrlSync } from '@/hooks/useUrlSync';

import type { TDurationFilter, TSortOption } from '@/types/filter';

interface CatalogPageProps {
	initialSearch: string
	initialDuration: TDurationFilter
	initialSort: TSortOption
}

export default function CatalogPage({
	initialSearch,
	initialDuration,
	initialSort
}: CatalogPageProps) {
	// Инициализация фильтров начальными значениями
	const initialFilters = {
		searchTerm: initialSearch,
		durationFilter: initialDuration,
		sortBy: initialSort
	}

	// Используем TanStack Query для получения ВСЕХ видео один раз при загрузке
	const {
		data: allVideos = [],
		isLoading,
		isError,
		refetch,
		isFetched
	} = useVideoCatalog('', undefined, 'date') // Получаем все видео без фильтрации

	// Используем хуки для фильтрации
	const { filters, setFilters, debouncedSearchTerm } = useVideoFilters(initialFilters);
	const filteredAndSortedVideos = useVideoFiltering(allVideos, debouncedSearchTerm, filters);
	
	// Синхронизация с URL
	useUrlSync(filters);

	// Функция для сброса фильтров
	const resetFilters = () => {
		setFilters({
			searchTerm: '',
			durationFilter: 'all',
			sortBy: 'date'
		})
	}


	return (
		<section className='py-8 w-full'>
			<div className='w-full max-w-7xl px-4 mx-auto'>
				<h1 className='text-3xl font-bold text-white dark:text-text-primary mb-8'>Видео-каталог</h1>
				<VideoFilters
					searchTerm={filters.searchTerm}
					durationFilter={filters.durationFilter}
					sortBy={filters.sortBy}
					onSearchChange={term => setFilters(prev => ({ ...prev, searchTerm: term }))}
					onDurationFilterChange={filter =>
						setFilters(prev => ({ ...prev, durationFilter: filter }))
					}
					onSortChange={sort => setFilters(prev => ({ ...prev, sortBy: sort }))}
				/>
				<VideoGrid
					videos={filteredAndSortedVideos}
					isLoading={isLoading}
					isFetched={isFetched}
					isError={isError}
					onRetry={refetch}
					onResetFilters={resetFilters}
				/>
			</div>
		</section>
	)
}