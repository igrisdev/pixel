export default function EscalatorSkeleton() {
  return (
    <div className="bg-gray-200 border-2 border-gray-300 p-3 flex items-center animate-pulse">
      <div className="w-12 h-12 bg-gray-300 rounded border-2 border-gray-400 mr-4"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
        <div className="flex gap-1">
          <div className="h-5 w-12 bg-gray-300 rounded"></div>
          <div className="h-5 w-12 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
