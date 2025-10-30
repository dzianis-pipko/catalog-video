'use client';

interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({ value, placeholder = 'Поиск...', onChange }: SearchInputProps) => {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-text-primary rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all-custom"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};