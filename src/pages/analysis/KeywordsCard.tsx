import { motion } from 'framer-motion';
import Tag from '@/components/Tag';

const keywords = [
  { text: '카페', count: 12 },
  { text: '산책', count: 8 },
  { text: '독서', count: 7 },
  { text: '운동', count: 6 },
  { text: '친구', count: 5 },
  { text: '영화', count: 4 },
  { text: '요리', count: 3 },
  { text: '음악', count: 3 },
];

export default function KeywordsCard() {
  return (
    <motion.div
      className="bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] p-6 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <h2 className="text-lg lg:text-[20px] font-bold text-[#2b2b2b] mb-6">
        자주 등장한 키워드
      </h2>
      
      {/* 키워드 태그들 */}
      <div className="flex flex-wrap gap-[8px]">
        {keywords.map((keyword, index) => (
          <Tag 
            key={index} 
            text={keyword.text} 
            count={keyword.count}
            variant={index < 4 ? 'primary' : 'secondary'}
          />
        ))}
      </div>
    </motion.div>
  );
}

