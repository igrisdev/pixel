export default function MemberSkeleton() {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 animate-pulse border border-gray-700">
      <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-3"></div>
      <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto mb-3"></div>
      <div className="flex flex-wrap justify-center gap-1 mt-2">
        <div className="h-5 w-12 bg-gray-700 rounded"></div>
        <div className="h-5 w-12 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}
