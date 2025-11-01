'use client';

import { useEffect, useState } from 'react';

import { VideoFilters } from '@/components/ui/video-filters/VideoFilters';
import { VideoGrid } from '@/components/ui/video-grid/VideoGrid';

import { useVideoCatalog } from '@/hooks/useVideoCatalog';
import { useVideoFilters } from '@/hooks/useVideoFilters';
import { mapDurationFilter } from '@/utils/mapDurationFilter';

import type { IVideo } from '@/types/video';
import type { DurationFilter, SortOption } from '@/types/filter';

interface CatalogPageProps {
	initialVideos: IVideo[]
	initialSearch: string
	initialDuration: DurationFilter
	initialSort: SortOption
}

export default function CatalogPage({
	initialVideos,
	initialSearch,
	initialDuration,
	initialSort
}: CatalogPageProps) {
	// Используем состояние для видео, чтобы обновлять их при необходимости
	const [videos, setVideos] = useState<IVideo[]>(initialVideos)

	// Инициализация фильтров серверными значениями
	const initialFilters = {
		searchTerm: initialSearch,
		durationFilter: initialDuration,
		sortBy: initialSort
	}

	// Используем фильтрацию с текущими видео и начальными фильтрами
	const { filters, setFilters, filteredAndSortedVideos } = useVideoFilters(videos, initialFilters)

	// Используем TanStack Query для получения обновленных данных при изменении фильтров
	const {
		data: updatedData,
		isLoading,
		isError,
		refetch
	} = useVideoCatalog(filters.searchTerm, mapDurationFilter(filters.durationFilter), filters.sortBy)

	// Обновляем видео, когда приходят обновленные данные
	useEffect(() => {
		if (updatedData) {
			setVideos(updatedData)
		}
	}, [updatedData])

	// Функция для сброса фильтров
	const resetFilters = () => {
		setFilters({
			searchTerm: '',
			durationFilter: 'all',
			sortBy: 'date'
		})
	}

	// Обновление данных при изменении фильтров
	useEffect(() => {
		refetch()
	}, [filters.searchTerm, filters.durationFilter, filters.sortBy])


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
					isError={isError}
					onRetry={refetch}
					onResetFilters={resetFilters}
				/>
			</div>
		</section>
	)
}