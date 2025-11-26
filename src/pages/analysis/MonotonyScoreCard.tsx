import { motion } from 'framer-motion';

export default function MonotonyScoreCard() {
  return (
    <motion.div
      className="relative min-h-[160px] lg:h-[181px] rounded-[24px] overflow-hidden bg-[#000000]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* 오른쪽 그라데이션 원형 */}
      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[120px] lg:w-[150px] h-[120px] lg:h-[150px] bg-[#6445EF] blur-2xl opacity-30 rounded-full" />
      
      {/* 컨텐츠 */}
      <div className="relative px-6 lg:px-8 py-6 lg:py-7 flex flex-col h-full">
        <h3 className="text-xl lg:text-[24px] font-bold text-white mb-2 leading-none">
          현재 단조로움 지수
        </h3>
        <p className="text-sm lg:text-[16px] text-[#9e89ff] mb-auto leading-none">
          일상에 변화가 필요해요!
        </p>
        
        {/* 점수 */}
        <div className="flex items-baseline gap-1">
          <span className="text-4xl lg:text-[52px] font-medium text-[#bdb3ff] leading-none">80</span>
          <span className="text-lg lg:text-[24px] font-medium text-[#acacac] leading-none">/100</span>
        </div>
      </div>
    </motion.div>
  );
}

