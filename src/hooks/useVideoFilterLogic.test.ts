import { renderHook, act } from '@testing-library/react';
import { useVideoFilters, useVideoFiltering } from './useVideoFilterLogic';
import type { IVideo } from '@/types/video';
import type { TDurationFilter, TSortOption } from '@/types/filter';

describe('useVideoFilters', () => {
  const initialFilters = {
    searchTerm: '',
    durationFilter: 'all' as TDurationFilter,
    sortBy: 'date' as TSortOption,
  };

  test('should initialize with correct initial filters', () => {
    const { result } = renderHook(() => useVideoFilters(initialFilters));

    expect(result.current.filters).toEqual(initialFilters);
    expect(result.current.debouncedSearchTerm).toBe(initialFilters.searchTerm);
  });

 test('should update filters correctly', () => {
    const { result } = renderHook(() => useVideoFilters(initialFilters));

    act(() => {
      result.current.setFilters({
        searchTerm: 'test',
        durationFilter: '<5',
        sortBy: 'title',
      });
    });

    expect(result.current.filters).toEqual({
      searchTerm: 'test',
      durationFilter: '<5',
      sortBy: 'title',
    });
  });

  test('should debounce search term correctly', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useVideoFilters(initialFilters));

    // Update the search term
    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        searchTerm: 'new search',
      });
    });

    // At this point, debouncedSearchTerm should still be the original value
    expect(result.current.debouncedSearchTerm).toBe(initialFilters.searchTerm);

    // Fast-forward time to trigger the debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now debouncedSearchTerm should be updated
    expect(result.current.debouncedSearchTerm).toBe('new search');

    jest.useRealTimers();
  });

  test('should handle debouncing with multiple updates', () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useVideoFilters(initialFilters));

    // Update the search term multiple times quickly
    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        searchTerm: 'first',
      });
    });

    act(() => {
      result.current.setFilters({
        ...result.current.filters,
        searchTerm: 'second',
      });
    });

    // At this point, debouncedSearchTerm should still be the original value
    expect(result.current.debouncedSearchTerm).toBe(initialFilters.searchTerm);

    // Fast-forward time to trigger the debounce (only the last update should take effect)
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now debouncedSearchTerm should be updated to the last value
    expect(result.current.debouncedSearchTerm).toBe('second');

    jest.useRealTimers();
  });
});

describe('useVideoFiltering', () => {
  const mockVideos: IVideo[] = [
    {
      id: '1',
      title: 'React Basics',
      author: 'John Doe',
      durationSec: 300, // 5 minutes
      publishedAt: '2023-01T00:00:00.000Z',
      thumbnail: 'thumbnail1.jpg',
    },
    {
      id: '2',
      title: 'Advanced TypeScript',
      author: 'Jane Smith',
      durationSec: 1200, // 20 minutes
      publishedAt: '2023-02-01T00:00:00.000Z',
      thumbnail: 'thumbnail2.jpg',
    },
    {
      id: '3',
      title: 'Next.js Fundamentals',
      author: 'Bob Johnson',
      durationSec: 1800, // 30 minutes
      publishedAt: '2023-03-01T00:00:00.000Z',
      thumbnail: 'thumbnail3.jpg',
    },
    {
      id: '4',
      title: 'Tailwind CSS',
      author: 'Alice Williams',
      durationSec: 180, // 3 minutes
      publishedAt: '2023-04-01T00:00:00.000Z',
      thumbnail: 'thumbnail4.jpg',
    },
  ];

  test('should return all videos when no filters applied', () => {
    const filters = { durationFilter: 'all' as TDurationFilter, sortBy: 'date' as TSortOption };
    const { result } = renderHook(() => useVideoFiltering(mockVideos, '', filters));

    expect(result.current).toHaveLength(4);
    expect(result.current).toEqual(mockVideos);
  });

  test('should filter videos by search term (case insensitive)', () => {
    const filters = { durationFilter: 'all' as TDurationFilter, sortBy: 'date' as TSortOption };
    const { result } = renderHook(() => useVideoFiltering(mockVideos, 'react', filters));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('React Basics');
  });

  test('should filter videos by duration <5', () => {
    const filters = { durationFilter: '<5' as TDurationFilter, sortBy: 'date' as TSortOption };
    const { result } = renderHook(() => useVideoFiltering(mockVideos, '', filters));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Tailwind CSS'); // 3 minutes
  });

 test('should filter videos by duration 5-20', () => {
    const filters = { durationFilter: '5-20' as TDurationFilter, sortBy: 'date' as TSortOption };
    const { result } = renderHook(() => useVideoFiltering(mockVideos, '', filters));

    expect(result.current).toHaveLength(2);
    expect(result.current[0].title).toBe('React Basics'); // 5 minutes
    expect(result.current[1].title).toBe('Advanced TypeScript'); // 20 minutes
  });

  test('should filter videos by duration >20', () => {
    const filters = { durationFilter: '>20' as TDurationFilter, sortBy: 'date' as TSortOption };
    const { result } = renderHook(() => useVideoFiltering(mockVideos, '', filters));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Next.js Fundamentals'); // 30 minutes
  });

  test('should sort videos by date (newest first)', () => {
    const filters = { durationFilter: 'all' as TDurationFilter, sortBy: 'date' as TSortOption };
    const { result } = renderHook(() => useVideoFiltering(mockVideos, '', filters));

    // Videos should be sorted by date (newest first)
    expect(result.current[0].title).toBe('Tailwind CSS'); // April 1, 2023
    expect(result.current[1].title).toBe('Next.js Fundamentals'); // March 1, 2023
    expect(result.current[2].title).toBe('Advanced TypeScript'); // February 1, 2023
    expect(result.current[3].title).toBe('React Basics'); // January 1, 2023
  });

  test('should sort videos by title', () => {
    const filters = { durationFilter: 'all' as TDurationFilter, sortBy: 'title' as TSortOption };
    const { result } = renderHook(() => useVideoFiltering(mockVideos, '', filters));

    // Videos should be sorted by title alphabetically
    expect(result.current[0].title).toBe('Advanced TypeScript');
    expect(result.current[1].title).toBe('Next.js Fundamentals');
    expect(result.current[2].title).toBe('React Basics');
    expect(result.current[3].title).toBe('Tailwind CSS');
  });

  test('should combine search and duration filters', () => {
    const filters = { durationFilter: '5-20' as TDurationFilter, sortBy: 'date' as TSortOption };
    const { result } = renderHook(() => useVideoFiltering(mockVideos, 'advanced', filters));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Advanced TypeScript');
  });

 test('should return empty array when no videos match filters', () => {
    const filters = { durationFilter: '<5' as TDurationFilter, sortBy: 'date' as TSortOption };
    const { result } = renderHook(() => useVideoFiltering(mockVideos, 'nonexistent', filters));

    expect(result.current).toHaveLength(0);
  });
});