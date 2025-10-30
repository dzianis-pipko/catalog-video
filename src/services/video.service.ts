import { axiosClassic } from '@/api/axios'
import type { IVideo } from '@/types/video'

class VideoService {
	private _VIDEOS = '/api/videos'

	async getVideoCatalog(
		search?: string,
		duration?: 'short' | 'medium' | 'long',
		sort?: 'title' | 'date'
	) {
		const params = new URLSearchParams()
		if (search) params.append('search', search)
		if (duration) params.append('duration', duration)
		if (sort) params.append('sort', sort)

		const queryString = params.toString()
		// Используем относительный путь, который будет корректно обработан axios с новой конфигурацией
		const url = queryString ? `${this._VIDEOS}?${queryString}` : this._VIDEOS

		const response = await axiosClassic.get<IVideo[]>(url)
		return response.data
	}

	async getVideoById(id: string) {
		// Используем относительный путь для получения видео по ID
		const response = await axiosClassic.get<IVideo>(`${this._VIDEOS}/${id}`)
		return response.data
	}
}

export const videoService = new VideoService()
