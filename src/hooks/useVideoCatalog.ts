import { useQuery } from '@tanstack/react-query'
import { videoService } from '@/services/video.service'
import type { SortOption, DurationValue } from '@/types/filter'

export const useVideoCatalog = (
	search?: string,
	duration?: DurationValue,
	sort?: SortOption
) => {
	return useQuery({
		queryKey: ['video-catalog', search, duration, sort],
		queryFn: () => videoService.getVideoCatalog(search, duration, sort),
		retry: false,
	refetchOnWindowFocus: false,
	})
}