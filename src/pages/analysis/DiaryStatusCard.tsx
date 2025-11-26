import { motion } from 'framer-motion';
import ContributionCalendar from '@/components/ContributionCalendar';

export default function DiaryStatusCard() {
  return (
    <motion.div
      className="bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] p-6 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="mb-4">
        <h2 className="text-lg lg:text-[20px] font-bold text-[#2b2b2b] mb-1">일기 작성 현황</h2>
        <p className="text-sm lg:text-[14px] text-[#6b6b6b]">7일 연속 작성 중이에요! 🔥</p>
      </div>
      
      <ContributionCalendar />
    </motion.div>
  );
}

