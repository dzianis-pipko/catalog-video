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
  videosData = require('../../../../data/videos.json');
} catch (error) {
  console.error('Ошибка при загрузке мок-данных:', error);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Поиск видео по ID
  const video = videosData.find(video => video.id === id);

  if (!video) {
    return new Response(
      JSON.stringify({ error: 'Видео не найдено' }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Возвращаем данные видео
  return new Response(JSON.stringify(video), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
    },
  });
}