import { motion } from 'framer-motion';

export default function DiaryCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-white/70 backdrop-blur-[250px] rounded-2xl md:rounded-[20px] lg:rounded-[24px] px-5 md:px-6 lg:px-[24px] py-6 md:py-7 lg:py-[28px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.04)]"
    >
      <div className="flex flex-col gap-3 md:gap-4 lg:gap-[16px]">
        {/* 날짜 스켈레톤 */}
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        
        {/* 태그 스켈레톤 */}
        <div className="flex gap-2 flex-wrap">
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-14 bg-gray-200 rounded-full animate-pulse" />
        </div>
        
        {/* 내용 스켈레톤 */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}

