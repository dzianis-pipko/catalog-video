import { useQuery } from '@tanstack/react-query'
import { videoService } from '@/services/video.service'

export const useVideoById = (id: string) => {
	return useQuery({
		queryKey: ['video', id],
		queryFn: () => videoService.getVideoById(id),
		retry: 1,
		enabled: !!id,
	})
}