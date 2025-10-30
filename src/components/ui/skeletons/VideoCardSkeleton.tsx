export const VideoCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
        <div className="flex justify-between">
        	<div className="h-4 bg-gray-200 dark:bg-gray-70 rounded w-1/4 animate-pulse"></div>
        	<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};