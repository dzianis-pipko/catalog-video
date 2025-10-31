'use client';

import { EmptyState } from '../empty-state/EmptyState';
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
	let containerClass = 'grid-responsive transition-all duration-300'

  if(isError) {
    result = (
      <EmptyState
        message="Ошибка загрузки видео"
        buttonText="Повторить"
        onClick={() => onRetry?.()}
        buttonAriaLabel="Повторить загрузку видео"
        textColor="text-red-500 dark:text-red-400"
      />
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
      <EmptyState
        message="Видео не найдены"
        buttonText="Сбросить фильтры"
        onClick={() => onResetFilters?.()}
        buttonAriaLabel="Сбросить фильтры"
      />
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