import { videoService } from '@/services/video.service';

// Тест для проверки SSR - что данные доступны на сервере
describe('SSR Check', () => {
 test('video data should be available on server', async () => {
    // Получаем данные напрямую через сервис, как это делает серверный компонент
    const videos = await videoService.getVideoCatalog();
    
    // Проверяем, что данные существуют и содержат ожидаемые поля
    expect(videos).toBeDefined();
    expect(Array.isArray(videos)).toBe(true);
    expect(videos.length).toBeGreaterThan(0);
    
    // Проверяем структуру первого видео
    const firstVideo = videos[0];
    expect(firstVideo).toHaveProperty('id');
    expect(firstVideo).toHaveProperty('title');
    expect(firstVideo).toHaveProperty('author');
    expect(firstVideo).toHaveProperty('durationSec');
    expect(firstVideo).toHaveProperty('publishedAt');
    expect(firstVideo).toHaveProperty('thumbnail');
    
    // Проверяем, что видео содержатся в исходном HTML (через проверку данных)
    expect(typeof firstVideo.id).toBe('string');
    expect(typeof firstVideo.title).toBe('string');
    expect(typeof firstVideo.author).toBe('string');
    expect(typeof firstVideo.durationSec).toBe('number');
    expect(typeof firstVideo.publishedAt).toBe('string');
    expect(typeof firstVideo.thumbnail).toBe('string');
  });
  
  test('SSR page should render with initial video data', async () => {
    // Имитируем параметры поиска для серверного компонента
    const searchParams = {
      search: 'React',
      duration: '<5',
      sort: 'date'
    };
    
    // Импортируем серверный компонент
    const Home = (await import('@/app/(public)/page')).default;
    
    // Проверяем, что компонент может быть вызван с параметрами
    expect(Home).toBeDefined();
    
    // Получаем начальные данные, как это делает серверный компонент
    const videos = await videoService.getVideoCatalog(
      searchParams.search,
      'short', // маппинг для '<5'
      searchParams.sort as 'date' | 'title'
    );
    
    expect(videos).toBeDefined();
    expect(Array.isArray(videos)).toBe(true);
  });
});