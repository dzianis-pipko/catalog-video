'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { IVideo } from '@/types/video';
import { formatDuration } from '@/utils/formatDuration';
import Button from '@/components/ui/button/Button';

const VideoDetailPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<IVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/videos/${id}`);
        if (!response.ok) throw new Error('Видео не найдено');
        const data = await response.json();
        setVideo(data);
      } catch (err) {
        setError(true);
        console.error('Ошибка загрузки видео:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideo();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Загрузка видео...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Видео не найдено</h1>
          <Button
            onClick={() => window.history.back()}
            ariaLabel="Вернуться назад"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          onClick={() => window.history.back()}
          ariaLabel="Вернуться к каталогу"
          className="mb-6 bg-gray-600 hover:bg-gray-700 text-white"
        >
          &larr; Назад к каталогу
        </Button>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Превью видео</span>
            </div>
          </div>
          
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{video.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-4">
              <span className="flex items-center">
                <span className="font-medium mr-2">Автор:</span>
                {video.author}
              </span>
              <span className="flex items-center">
                <span className="font-medium mr-2">Длительность:</span>
                {formatDuration(video.durationSec)}
              </span>
              <span className="flex items-center">
                <span className="font-medium mr-2">Дата публикации:</span>
                {formatDate(video.publishedAt)}
              </span>
            </div>
            
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Описание</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Здесь будет отображаться подробная информация о видео. В реальном приложении это может быть
                расширенное описание, теги, категории и другая метаинформация о видео.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetailPage;