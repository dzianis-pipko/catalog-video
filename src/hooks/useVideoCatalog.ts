import { useQuery } from '@tanstack/react-query'
import { videoService } from '@/services/video.service'
import type { TSortOption, TDurationValue } from '@/types/filter'

export const useVideoCatalog = (
	search?: string,
	duration?: TDurationValue,
	sort?: TSortOption
) => {
	return useQuery({
		queryKey: ['video-catalog', search, duration, sort],
		queryFn: () => videoService.getVideoCatalog(search, duration, sort),
		retry: false,
	refetchOnWindowFocus: false,
	})
}