import { NextRequest } from 'next/server';

// Типы для видео
type Video = {
  id: string;
  title: string;
  author: string;
  durationSec: number;
  publishedAt: string;
  thumbnail: string;
};

// Загружаем мок-данные
let videosData: Video[] = [];

try {
  videosData = require('../../../data/videos.json');
} catch (error) {
  console.error('Ошибка при загрузке мок-данных:', error);
}

export async function GET(request: NextRequest) {
  // Эмуляция случайных ошибок (примерно в 10% случаев)
  if (Math.random() < 0.1) {
    return new Response(
      JSON.stringify({ error: 'Ошибка сервера при загрузке видео' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Получаем параметры из URL
  const { searchParams } = request.nextUrl;
  const search = searchParams.get('search');
  const duration = searchParams.get('duration');

  // Фильтрация поисковому запросу
  let filteredVideos = videosData;

  if (search) {
    const searchTerm = search.toLowerCase();
    filteredVideos = filteredVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(searchTerm) ||
        video.author.toLowerCase().includes(searchTerm)
    );
  }

  // Фильтрация по длительности
  if (duration) {
    const now = new Date().getTime();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    filteredVideos = filteredVideos.filter((video) => {
      const videoDurationInMinutes = video.durationSec / 60;

      switch (duration) {
        case 'short':
          return videoDurationInMinutes < 5;
        case 'medium':
          return videoDurationInMinutes >= 5 && videoDurationInMinutes <= 20;
        case 'long':
          return videoDurationInMinutes > 20;
        default:
          return true;
      }
    });
  }

  // Сортировка по дате (новые сверху)
  filteredVideos.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Возвращаем ответ с кэшированием (revalidate каждые 60 секунд)
  return new Response(JSON.stringify(filteredVideos), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
    },
  });
}