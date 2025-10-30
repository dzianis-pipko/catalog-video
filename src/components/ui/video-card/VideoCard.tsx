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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">Автор: {video.author}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formatDuration(video.durationSec)}</span>
          <span>{formatDate(video.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
};