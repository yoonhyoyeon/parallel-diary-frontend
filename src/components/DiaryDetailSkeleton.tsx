import { motion } from 'framer-motion';

export default function DiaryDetailSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10 lg:p-[60px] lg:pt-[50px] flex flex-col flex-1"
    >
      {/* 날짜와 시간 스켈레톤 */}
      <div className="pb-3 md:pb-4 border-b border-gray-200/50 shrink-0">
        <div className="h-4 md:h-5 w-64 bg-gray-200 rounded animate-pulse" />
      </div>
      
      {/* 일기 내용 스켈레톤 */}
      <div className="w-full flex-1 py-4 md:py-5 lg:py-6 flex flex-col gap-3">
        <div className="h-4 md:h-5 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 md:h-5 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 md:h-5 w-5/6 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 md:h-5 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 md:h-5 w-4/5 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 md:h-5 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 md:h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* 주요 순간들 스켈레톤 */}
      <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 shrink-0 pt-4 md:pt-5 lg:pt-6 border-t border-gray-200/50">
        <div className="h-5 md:h-6 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-2 md:gap-3 flex-wrap">
          <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-16 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}


