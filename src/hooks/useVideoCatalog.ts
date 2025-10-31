import { useQuery } from '@tanstack/react-query'
import { videoService } from '@/services/video.service'

export const useVideoCatalog = (
	search?: string,
	duration?: 'short' | 'medium' | 'long',
	sort?: 'title' | 'date'
) => {
	return useQuery({
		queryKey: ['video-catalog', search, duration, sort],
		queryFn: () => videoService.getVideoCatalog(search, duration, sort),
		retry: false,
		refetchOnWindowFocus: false,
	})
}