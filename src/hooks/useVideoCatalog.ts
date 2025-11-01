import { useQuery } from '@tanstack/react-query'
import { videoService } from '@/services/video.service'
import type { IVideo } from '@/types/video'
import type { TSortOption, TDurationValue } from '@/types/filter'

export const useVideoCatalog = (
	search?: string,
	duration?: TDurationValue,
	sort?: TSortOption
) => {
	return useQuery<IVideo[]>({
		queryKey: ['video-catalog', search, duration, sort],
		queryFn: () => videoService.getVideoCatalog(search, duration, sort),
		retry: 1,
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000, // 5 минут
		gcTime: 10 * 60 * 1000, // 10 минут (вместо cacheTime)
		// Отключение автоматического рефетч при гидрации
		retryOnMount: false,
		// Установка placeholderData для избежания показа skeletons при гидрации
		placeholderData: (prevData) => prevData,
	})
}