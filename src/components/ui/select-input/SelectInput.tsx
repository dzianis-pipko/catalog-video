'use client';

interface SelectInputOption {
  value: string;
  label: string;
}

interface SelectInputProps<T> {
  value: T;
  options: SelectInputOption[];
  onChange: (value: T) => void;
  className?: string;
}

export const SelectInput = <T extends string>({ value, options, onChange, className = '' }: SelectInputProps<T>) => {
  return (
    <div className="relative">
      <select
        className={`w-full appearance-none px-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-text-primary rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all-custom ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};