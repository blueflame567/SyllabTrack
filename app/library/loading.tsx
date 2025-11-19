export default function LibraryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Filter Skeleton */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        {/* Syllabi List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
