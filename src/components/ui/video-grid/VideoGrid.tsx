'use client';

import { VideoCard } from '../video-card/VideoCard';
import { VideoCardSkeleton } from '../skeletons/VideoCardSkeleton';
import type { IVideo } from '@/types/video';

interface VideoGridProps {
  videos: IVideo[];
  isLoading: boolean;
}

export const VideoGrid = ({ videos, isLoading }: VideoGridProps) => {

  let result;
  if(isLoading){
    result = (
      [...Array(6)].map((_, index) => (
        <VideoCardSkeleton key={index} />
      ))
    )
  }else{
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
		<div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{/* {videos.map(video => (
				<VideoCard
					key={video.id}
					video={video}
				/>
			))} */}
      {result}
		</div>
	)
}