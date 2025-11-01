import { NextRequest } from 'next/server';

import videos from '@/data/videos.json';
import type { TSortOption } from '@/types/filter';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const search = searchParams.get('search')
	const duration = searchParams.get('duration')
	const sort = searchParams.get('sort') as TSortOption | null

	let filteredVideos = [...videos]

	// Поиск по названию
	if (search) {
		filteredVideos = filteredVideos.filter(video =>
			video.title.toLowerCase().includes(search.toLowerCase())
		)
	}

	// Фильтр по длительности
	if (duration) {
	switch (duration) {
			case 'short':
				filteredVideos = filteredVideos.filter(
					video => video.durationSec < 300 // < 5 минут
				)
				break
			case 'medium':
				filteredVideos = filteredVideos.filter(
					video => video.durationSec >= 300 && video.durationSec <= 1200 // 5-20 минут
				)
				break
			case 'long':
				filteredVideos = filteredVideos.filter(
					video => video.durationSec > 1200 // > 20 минут
				)
				break
			default:
				// Если получен неизвестный параметр длительности, не применяем фильтр
				break
		}
	}

	// Сортировка
	if (sort === 'title') {
		filteredVideos.sort((a, b) => a.title.localeCompare(b.title))
	} else {
		// По умолчанию сортировка по дате (новые сверху)
		filteredVideos.sort(
			(a, b) =>
				new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
		)
	}

	// Эмуляция ошибки в 10% случаев
	if (Math.random() < 0.1) {
	  return new Response(JSON.stringify({ error: 'Failed to fetch videos' }), {
	    status: 500,
	    headers: { 'Content-Type': 'application/json' }
	  })
	}

	// Задержка для имитации реального API
	await delay(500)

	// Добавляем кэширование для SSR
	const response = new Response(JSON.stringify(filteredVideos), {
	  status: 200,
	  headers: {
	    'Content-Type': 'application/json',
	    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' // Кэширование на 1 час
	  }
	});
	
	return response;
}