'use client';

import Button from '../button/Button';
import { VideoCardSkeleton } from '../skeletons/VideoCardSkeleton';
import { VideoCard } from '../video-card/VideoCard';
import type { IVideo } from '@/types/video';

interface VideoGridProps {
  videos: IVideo[];
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onResetFilters?: () => void;
}

export const VideoGrid = ({ videos, isLoading, isError, onRetry, onResetFilters }: VideoGridProps) => {

  let result
	let containerClass =
		'grid grid-cols-1 md:grid-cols-2 lg1200:grid-cols-3 gap-6 min-h-[600px] transition-all duration-300'

  if(isError) {
    result = (
      <div className="col-span-full text-center py-12 transition-opacity duration-300">
      	<p className="text-lg text-red-50 dark:text-red-400 mb-4">Ошибка загрузки видео</p>
      	<Button
      		onClick={() => onRetry?.()}
      		ariaLabel="Повторить загрузку видео"
      	>
      		Повторить
      	</Button>
      </div>
    );
  } else if(isLoading){
    result = (
      <>
        {[...Array(6)].map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </>
    )
  } else if (videos.length === 0) {
    result = (
      <div className="col-span-full text-center py-12 transition-opacity duration-300">
      	<p className="text-lg text-gray-300 dark:text-text-secondary mb-4">Видео не найдены</p>
      	<Button
      		onClick={() => onResetFilters?.()}
      		ariaLabel="Сбросить фильтры"
      	>
      		Сбросить фильтры
      	</Button>
      </div>
    );
  } else {
    result = (
      <>
        {videos.map(video => (
          <VideoCard
            key={video.id}
            video={video}
          />
        ))}
      </>
    )
  }
  
	return (
    <div className={containerClass}>
      {result}
    </div>
	)
}