import PageWrapper from './page-wrapper';
import { videoService } from '@/services/video.service';
import type { IVideo } from '@/types/video';

// Вспомогательная функция для маппинга фильтров
function mapDurationFilter(duration: string) {
  switch (duration) {
    case '<5':
      return 'short' as const;
    case '5-20':
      return 'medium' as const;
    case '>20':
      return 'long' as const;
    default:
      return undefined;
  }
}

// Серверный компонент для получения начальных данных
export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Инициализация фильтров из URL-параметров
  const initialSearch = (searchParams.search as string) || '';
  const initialDuration = (searchParams.duration as 'all' | '<5' | '5-20' | '>20') || 'all';
 const initialSort = (searchParams.sort as 'date' | 'title') || 'date';

 // Получение видео на сервере с обработкой ошибок
  let initialVideos: IVideo[] = [];
  try {
    initialVideos = await videoService.getVideoCatalog(
      initialSearch,
      mapDurationFilter(initialDuration),
      initialSort
    );
  } catch (error) {
    console.error('Error fetching videos:', error);
    // В случае ошибки возвращаем пустой массив
    initialVideos = [];
  }

  return (
    <PageWrapper
      initialVideos={initialVideos}
      initialSearch={initialSearch}
      initialDuration={initialDuration}
      initialSort={initialSort}
    />
  );
}
