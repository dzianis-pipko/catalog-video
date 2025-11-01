import { videoService } from '@/services/video.service';
import type { IVideo } from '@/types/video';
import { mapDurationFilter } from '@/utils/mapDurationFilter';
import type { TDurationFilter, TSortOption } from '@/types/filter';
import CatalogPage from './CatalogPage';

// Серверный компонент для получения начальных данных
export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Инициализация фильтров из URL-параметров
  const initialSearch = ((await searchParams).search as string) || '';
  const initialDuration = ((await searchParams).duration as TDurationFilter) || 'all';
  const initialSort = ((await searchParams).sort as TSortOption) || 'date';

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
    <CatalogPage
      initialVideos={initialVideos}
      initialSearch={initialSearch}
      initialDuration={initialDuration}
      initialSort={initialSort}
    />
  );
}
