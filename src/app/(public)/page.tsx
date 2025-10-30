'use client';

import { VideoGrid } from '@/components/ui/video-grid/VideoGrid';
import { VideoCardSkeleton } from '@/components/ui/skeletons/VideoCardSkeleton';
import type { IVideo } from '@/types/video';
import { useEffect, useState } from 'react';

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{loading ? 'Загрузка видео...' : 'Видео-каталог'}</h1>
        <VideoGrid videos={videos} isLoading={loading} />
      </div>
    </section>
  );
}
