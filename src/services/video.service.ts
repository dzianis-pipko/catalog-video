import { axiosClassic } from '@/api/axios'

import type { IDataVideo } from '@/types/example.ts'

class VideoService {
	private _VIDEOS = '/videos'

	getVideoCatalog() {
		return axiosClassic.get<IDataVideo>(`${this._VIDEOS}/example`)
	}
}

export const videoService = new VideoService()
