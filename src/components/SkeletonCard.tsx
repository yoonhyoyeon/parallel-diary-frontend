interface SkeletonCardProps {
  variant?: 'default' | 'score' | 'chart' | 'type' | 'calendar';
}

export default function SkeletonCard({ variant = 'default' }: SkeletonCardProps) {
  if (variant === 'score') {
    // 다채로움 지수 스켈레톤
    return (
      <div className="relative min-h-[160px] lg:h-[181px] rounded-[24px] overflow-hidden bg-[#000000] animate-pulse">
        <div className="relative px-6 lg:px-8 py-6 lg:py-7 flex flex-col h-full">
          <div className="h-6 lg:h-7 bg-gray-700 rounded w-48 mb-2" />
          <div className="h-4 bg-gray-700 rounded w-32 mb-auto" />
          <div className="flex items-baseline gap-1">
            <div className="h-12 lg:h-14 bg-gray-700 rounded w-20" />
            <div className="h-6 bg-gray-700 rounded w-12" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'chart') {
    // 그래프 스켈레톤
    return (
      <div className="bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] p-6 lg:p-8 min-h-[300px] lg:h-[359px] animate-pulse">
        <div className="h-5 lg:h-6 bg-gray-200 rounded w-40 mb-6" />
        <div className="w-full h-[220px] lg:h-[260px] bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (variant === 'type') {
    // 일상 타입 스켈레톤
    return (
      <div>
        <div className="h-5 lg:h-6 bg-gray-200 rounded w-32 mb-4 lg:mb-6 animate-pulse" />
        <div className="relative bg-linear-to-br from-[#b39fff] via-[#a591ff] to-[#9681ff] rounded-[20px] lg:rounded-[24px] overflow-hidden animate-pulse">
          <div className="absolute inset-0 pointer-events-none shadow-[0px_3px_50.6px_0px_inset_#6343ff]" />
          <div className="relative px-6 py-8 lg:px-8 lg:py-10 flex flex-col items-center gap-4 lg:gap-6">
            <div className="w-[120px] h-[80px] lg:w-[140px] lg:h-[90px] bg-white/20 rounded" />
            <div className="h-5 lg:h-6 bg-white/20 rounded w-32" />
            <div className="h-4 bg-white/20 rounded w-64" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'calendar') {
    // 캘린더 스켈레톤
    return (
      <div className="w-full overflow-hidden bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] p-6 lg:p-8 animate-pulse">
        <div className="h-5 lg:h-6 bg-gray-200 rounded w-32 mb-4" />
        <div className="w-full h-32 bg-gray-100 rounded" />
      </div>
    );
  }

  // 기본 스켈레톤
  return (
    <div className="bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] p-6 lg:p-8 animate-pulse">
      <div className="h-5 lg:h-6 bg-gray-200 rounded w-40 mb-6" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

