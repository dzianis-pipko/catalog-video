'use client';

import type { IVideo } from '@/types/video';
import Image from 'next/image';
import { formatDuration } from '@/utils/formatDuration';

interface VideoCardProps {
  video: IVideo;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer group"
      tabIndex={0}
      onClick={() => {
        window.location.href = `/video/${video.id}`;
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          window.location.href = `/video/${video.id}`;
        }
      }}
      role="link"
      aria-label={`Видео: ${video.title}. Автор: ${video.author}. Длительность: ${formatDuration(video.durationSec)}. Дата публикации: ${formatDate(video.publishedAt)}`}
    >
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          priority={false}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-image.jpg';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-1 line-clamp-2 dark:group-hover:text-text-primary">
        	{video.title}
        </h3>
        <p className="text-gray-600 dark:text-text-secondary text-sm mb-2 dark:group-hover:text-text-secondary">Автор: {video.author}</p>
        <div className="flex justify-between text-sm text-gray-500 dark:text-text-muted dark:group-hover:text-text-muted">
        	<span>{formatDuration(video.durationSec)}</span>
        	<span>{formatDate(video.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
};