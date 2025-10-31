import { renderHook, act } from '@testing-library/react';
import { useVideoFilters } from './useVideoFilters';

// Extend expect with Testing Library matchers
import '@testing-library/jest-dom';

// Mock video data
const mockVideos = [
  {
    id: '1',
    title: 'React Tutorial',
    author: 'John Doe',
    durationSec: 300, // 5 minutes
    publishedAt: '2023-05-15T10:00:00Z',
    thumbnail: 'https://picsum.photos/300/200?random=1',
  },
  {
    id: '2',
    title: 'Next.js Basics',
    author: 'Jane Smith',
    durationSec: 1200, // 20 minutes
    publishedAt: '2023-06-20T14:30:00Z',
    thumbnail: 'https://picsum.photos/300/200?random=2',
  },
  {
    id: '3',
    title: 'TypeScript Advanced',
    author: 'Bob Johnson',
    durationSec: 3600, // 60 minutes
    publishedAt: '2023-04-10T09:15:00Z',
    thumbnail: 'https://picsum.photos/300/200?random=3',
  },
];

describe('useVideoFilters', () => {
  test('should return all videos when no filters applied', () => {
    const { result } = renderHook(() => useVideoFilters(mockVideos));
    
    expect(result.current.filteredAndSortedVideos).toHaveLength(3);
    expect(result.current.filters.searchTerm).toBe('');
    expect(result.current.filters.durationFilter).toBe('all');
    expect(result.current.filters.sortBy).toBe('date');
  });

 test('should filter videos by search term', async () => {
    const { result } = renderHook(() => useVideoFilters(mockVideos));
    
    // Update search term
    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        searchTerm: 'React',
      });
    });
    
    // Wait for debounce
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
    });
    
    expect(result.current.filteredAndSortedVideos).toHaveLength(1);
    expect(result.current.filteredAndSortedVideos[0].title).toBe('React Tutorial');
  });

  test('should filter videos by duration <5 min', async () => {
    const { result } = renderHook(() => useVideoFilters(mockVideos));
    
    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        durationFilter: '<5',
      });
    });
    
    expect(result.current.filteredAndSortedVideos).toHaveLength(0); // No videos under 5 min
    
    // Add a video under 5 min to test
    const videosWithShort = [
      ...mockVideos,
      {
        id: '4',
        title: 'Short Video',
        author: 'Test User',
        durationSec: 240, // 4 minutes
        publishedAt: '2023-07-01T12:00:00Z',
        thumbnail: 'https://picsum.photos/300/200?random=4',
      }
    ];
    
    const { result: result2 } = renderHook(() => useVideoFilters(videosWithShort));
    
    act(() => {
      result2.current.setFilters({
        ...result2.current.filters,
        durationFilter: '<5',
      });
    });
    
    expect(result2.current.filteredAndSortedVideos).toHaveLength(1);
    expect(result2.current.filteredAndSortedVideos[0].title).toBe('Short Video');
  });

  test('should filter videos by duration 5-20 min', () => {
    const { result } = renderHook(() => useVideoFilters(mockVideos));
    
    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        durationFilter: '5-20',
      });
    });
    
    expect(result.current.filteredAndSortedVideos).toHaveLength(1);
    expect(result.current.filteredAndSortedVideos[0].title).toBe('React Tutorial');
  });

  test('should filter videos by duration >20 min', () => {
    const { result } = renderHook(() => useVideoFilters(mockVideos));
    
    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        durationFilter: '>20',
      });
    });
    
    expect(result.current.filteredAndSortedVideos).toHaveLength(1);
    expect(result.current.filteredAndSortedVideos[0].title).toBe('TypeScript Advanced');
  });

  test('should sort videos by date (newest first)', () => {
    const { result } = renderHook(() => useVideoFilters(mockVideos));
    
    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        sortBy: 'date',
      });
    });
    
    const sortedVideos = result.current.filteredAndSortedVideos;
    // Should be sorted with newest first: June 20, May 15, April 10
    expect(sortedVideos[0].title).toBe('Next.js Basics');
    expect(sortedVideos[1].title).toBe('React Tutorial');
    expect(sortedVideos[2].title).toBe('TypeScript Advanced');
  });

  test('should sort videos by title', () => {
    const { result } = renderHook(() => useVideoFilters(mockVideos));
    
    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        sortBy: 'title',
      });
    });
    
    const sortedVideos = result.current.filteredAndSortedVideos;
    // Should be sorted alphabetically by title
    expect(sortedVideos[0].title).toBe('Next.js Basics');
    expect(sortedVideos[1].title).toBe('React Tutorial');
    expect(sortedVideos[2].title).toBe('TypeScript Advanced');
  });

  test('should combine search and duration filters', async () => {
    const { result } = renderHook(() => useVideoFilters(mockVideos));
    
    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        searchTerm: 'Next.js',
        durationFilter: '5-20',
      });
    });
    
    // Wait for debounce
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
    });
    
    expect(result.current.filteredAndSortedVideos).toHaveLength(1);
    expect(result.current.filteredAndSortedVideos[0].title).toBe('Next.js Basics');
  });

  test('should handle initial filters', () => {
    const initialFilters = {
      searchTerm: 'React',
      durationFilter: 'all' as const,
      sortBy: 'title' as const,
    };
    
    const { result } = renderHook(() => useVideoFilters(mockVideos, initialFilters));
    
    expect(result.current.filters.searchTerm).toBe('React');
    expect(result.current.filters.durationFilter).toBe('all');
    expect(result.current.filters.sortBy).toBe('title');
 });
});