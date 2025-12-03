import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import DailyTypeDisplay, { type DailyTypeValue } from '@/components/DailyTypeDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DailyTypeCard() {
  const [dailyType, setDailyType] = useState<DailyTypeValue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API로부터 일상 타입 가져오기
  useEffect(() => {
    const fetchDailyType = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: API 연결
        // const data = await getDailyType();
        // setDailyType(data.type);
        
        // 임시 데이터
        setTimeout(() => {
          setDailyType('action');
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error('일상 타입 조회 실패:', err);
        setError('일상 타입을 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };
    
    fetchDailyType();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h2 className="text-lg lg:text-[20px] font-bold text-[#2b2b2b] mb-4 lg:mb-6">
        나의 일상 타입
      </h2>
      
      {isLoading ? (
        /* 로딩 상태 */
        <div className="bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] flex items-center justify-center py-12 lg:py-16">
          <LoadingSpinner size="sm" />
        </div>
      ) : error ? (
        /* 에러 상태 */
        <div className="bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] flex items-center justify-center py-12 lg:py-16">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : dailyType ? (
        /* 타입 카드 */
        <DailyTypeDisplay type={dailyType} />
      ) : null}
    </motion.div>
  );
}

