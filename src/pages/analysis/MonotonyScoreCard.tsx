import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getMonotonyIndices } from '@/services/diaryService';
import Button from '@/components/Button';
import SkeletonCard from '@/components/SkeletonCard';

interface MonotonyScoreCardProps {
  diaryCount: number;
  isLoadingDiaries: boolean;
}

export default function MonotonyScoreCard({ diaryCount, isLoadingDiaries }: MonotonyScoreCardProps) {
  const navigate = useNavigate();
  const [monotonyScore, setMonotonyScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      // 일기 개수 로딩 중이면 대기
      if (isLoadingDiaries) return;
      
      try {
        setIsLoading(true);
        
        // 일기가 3개 미만이면 데이터 없음 처리
        if (diaryCount < 3) {
          setIsLoading(false);
          return;
        }
        
        // 일기가 3개 이상이면 지수 데이터 가져오기
        const data = await getMonotonyIndices();
        
        if (data.length > 0) {
          const sortedData = [...data].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setMonotonyScore(sortedData[0].index);
        }
      } catch (err) {
        console.error('다채로움 지수 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchScore();
  }, [diaryCount, isLoadingDiaries]);

  const score = monotonyScore !== null ? 100 - monotonyScore : 0;
  
  // 점수에 따른 상태 결정 (높을수록 좋음)
  const getScoreStatus = (score: number) => {
    if (score >= 70) {
      return {
        message: '다채로운 일상을 보내고 있어요!',
        messageColor: '#9E89FF',
        scoreColor: '#9E89FF',
        gradientOpacity: 0.40,
        emoji: '✨'
      };
    } else if (score >= 50) {
      return {
        message: '적당한 일상을 보내고 있어요',
        messageColor: '#BDB3FF',
        scoreColor: '#BDB3FF',
        gradientOpacity: 0.30,
        emoji: '😊'
      };
    } else if (score >= 30) {
      return {
        message: '일상에 변화가 필요해요',
        messageColor: '#D9D4FF',
        scoreColor: '#D9D4FF',
        gradientOpacity: 0.20,
        emoji: '⚠️'
      };
    } else {
      return {
        message: '일상에 큰 변화가 필요해요!',
        messageColor: '#EAE8FF',
        scoreColor: '#EAE8FF',
        gradientOpacity: 0.10,
        emoji: '🚨'
      };
    }
  };

  const status = getScoreStatus(score);

  if (isLoading) {
    return <SkeletonCard variant="score" />;
  }

  return (
    <div className="relative min-h-[160px] lg:h-[181px] rounded-[24px] overflow-hidden bg-[#000000]">
      {/* 그라데이션 원형 */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[120px] lg:w-[150px] h-[120px] lg:h-[150px] bg-[#6445EF] blur-2xl rounded-full" 
        style={{ opacity: monotonyScore === null ? 0.2 : status.gradientOpacity }}
      />
      
      {monotonyScore === null ? (
        /* 데이터 없음 */
        <div className="relative px-6 lg:px-8 py-6 lg:py-7 flex flex-col h-full">
          <h3 className="text-xl lg:text-[24px] font-bold text-white mb-2 leading-none">
            현재 다채로움 지수
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 pb-6 pt-10 lg:pt-5">
            <div>
              <h4 className="text-base lg:text-[18px] font-bold text-white mb-2">
                데이터가 충분하지 않아요!
              </h4>
              <p className="text-sm lg:text-[14px] text-[#9ca3af]">
                일기를 더 작성하면 분석이 가능해요!
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => navigate({ to: '/create' })}
              className="lg:hidden"
            >
              일기 작성하기
            </Button>
          </div>
        </div>
      ) : (
        /* 데이터 표시 */
        <div className="relative px-6 lg:px-8 py-6 lg:py-7 flex flex-col h-full">
          <h3 className="text-xl lg:text-[24px] font-bold text-white mb-2 leading-none">
            현재 다채로움 지수
          </h3>
          <p 
            className="text-sm lg:text-[16px] mb-auto leading-none font-medium"
            style={{ color: status.messageColor }}
          >
            {status.emoji} {status.message}
          </p>
          
          {/* 점수 */}
          <div className="flex items-baseline gap-1">
            <span 
              className="text-4xl lg:text-[52px] font-medium leading-none"
              style={{ color: status.scoreColor }}
            >
              {score}
            </span>
            <span className="text-lg lg:text-[24px] font-medium text-[#acacac] leading-none">/100</span>
          </div>
        </div>
      )}
    </div>
  );
}

