import { videoService } from '@/services/video.service';
import type { IVideo } from '@/types/video';
import type { TDurationFilter, TSortOption } from '@/types/filter';
import { dehydrate, QueryClient, HydrationBoundary } from '@tanstack/react-query';
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

  // Создаем экземпляр QueryClient на сервере
  const queryClient = new QueryClient();

  // Получение ВСЕХ видео на сервере с обработкой ошибок (для фильтрации на клиенте)
  let allVideos: IVideo[] = [];
  try {
    allVideos = await videoService.getVideoCatalog('', undefined, 'date'); // Получаем все видео без фильтрации
    
    // Предварительно заполняем кэш данными
    queryClient.setQueryData(
      ['video-catalog', '', undefined, 'date'],
      allVideos
    );
  } catch (error) {
    console.error('Error fetching videos:', error);
    // В случае ошибки возвращаем пустой массив
    allVideos = [];
  }

  // Гидратируем кэш
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CatalogPage
        initialSearch={initialSearch}
        initialDuration={initialDuration}
        initialSort={initialSort}
      />
    </HydrationBoundary>
  );
}
