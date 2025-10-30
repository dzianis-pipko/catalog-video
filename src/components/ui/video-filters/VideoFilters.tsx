'use client';

import type { DurationFilter } from '@/hooks/useVideoFilters';
import { SearchInput } from '../search-input/SearchInput';
import { SelectInput } from '../select-input/SelectInput';

interface VideoFiltersProps {
  searchTerm: string;
  durationFilter: DurationFilter;
  sortBy: 'date' | 'title';
  onSearchChange: (term: string) => void;
  onDurationFilterChange: (filter: DurationFilter) => void;
  onSortChange: (sort: 'date' | 'title') => void;
}

export const VideoFilters = ({
  searchTerm,
  durationFilter,
  sortBy,
  onSearchChange,
  onDurationFilterChange,
  onSortChange,
}: VideoFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center">
      <div className="flex-1 w-full">
        <SearchInput
          value={searchTerm}
          placeholder="Поиск по названию..."
          onChange={onSearchChange}
        />
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <SelectInput<DurationFilter>
          value={durationFilter}
          onChange={onDurationFilterChange}
          className="min-w-[150px]"
          options={[
            { value: 'all', label: 'Все длительности' },
            { value: '<5', label: 'Короче 5 мин' },
            { value: '5-20', label: '5-20 мин' },
            { value: '>20', label: 'Дольше 20 мин' },
          ]}
        />
        
        <SelectInput<'date' | 'title'>
          value={sortBy}
          onChange={onSortChange}
          className="min-w-[150px]"
          options={[
            { value: 'date', label: 'Сортировать по дате' },
            { value: 'title', label: 'Сортировать по названию' },
          ]}
        />
      </div>
    </div>
  );
};