import { motion } from 'framer-motion';
import BarChart from '@/components/BarChart';

const behaviorData = [
  { label: '새로운\n시도', value: 15, color: '#735ede' },
  { label: '계획된\n변화', value: 25, color: '#9583e5' },
  { label: '반복된 선택', value: 60, color: '#bdb3ff' },
];

export default function BehaviorPatternCard() {
  return (
    <motion.div
      className="bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] p-6 lg:p-10 min-h-[300px] lg:h-[359px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h2 className="text-lg lg:text-[20px] font-bold text-[#151618] mb-6">
        행동 패턴 분포
      </h2>

      <BarChart data={behaviorData} />
    </motion.div>
  );
}

