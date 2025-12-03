import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ContributionCalendar from '@/components/ContributionCalendar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getDiaryActivity } from '@/services/diaryService';

export default function DiaryStatusCard() {
  const [activityData, setActivityData] = useState<Array<{ date: string; hasEntry: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  // API로부터 일기 작성 현황 가져오기
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDiaryActivity();
        
        // API 응답을 UI 형식으로 변환
        const formattedData = data.map(item => ({
          date: item.date,
          hasEntry: item.diary,
        }));
        
        setActivityData(formattedData);
        
        // 연속 작성일 계산 (최근 날짜부터 역순으로 확인)
        let currentStreak = 0;
        const sortedData = [...data].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        for (const item of sortedData) {
          if (item.diary) {
            currentStreak++;
          } else {
            break;
          }
        }
        
        setStreak(currentStreak);
      } catch (err) {
        console.error('일기 작성 현황 조회 실패:', err);
        setError('일기 작성 현황을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivity();
  }, []);

  return (
    <motion.div
      className="w-full min-w-0 overflow-hidden bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] p-6 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="mb-4">
        <h2 className="text-lg lg:text-[20px] font-bold text-[#2b2b2b] mb-1">일기 작성 현황</h2>
        {!isLoading && !error && streak > 0 && (
          <p className="text-sm lg:text-[14px] text-[#6b6b6b]">{streak}일 연속 작성 중이에요! 🔥</p>
        )}
      </div>
      
      {isLoading ? (
        /* 로딩 상태 */
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="sm" />
        </div>
      ) : error ? (
        /* 에러 상태 */
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : (
        /* 캘린더 */
        <ContributionCalendar data={activityData} />
      )}
    </motion.div>
  );
}

