import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';
import ArrowRightIcon from '@/assets/icons/arrow_right.svg?react';
import ScenarioCard from '@/components/ScenarioCard';
import { getRecommendedActivities } from '@/services/diaryService';
import SkeletonCard from '@/components/SkeletonCard';

export interface Scenario {
  id: string;
  emoji: string;
  title: string;
  description: string;
  score: number;
}

export default function ScenarioRecommendCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // API로부터 추천 활동 가져오기
  useEffect(() => {
    const fetchRecommendedActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getRecommendedActivities();
        
        // API 응답을 Scenario 형식으로 변환
        const formattedScenarios: Scenario[] = data.map((activity) => ({
          id: activity.id,
          emoji: activity.emoji,
          title: activity.title,
          description: activity.content,
          score: 0, // ScenarioCard 내부에서 ID 기반으로 생성
        }));
        
        setScenarios(formattedScenarios);
      } catch (err) {
        console.error('추천 활동 조회 실패:', err);
        setError('추천 활동을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendedActivities();
  }, []);

  const itemsPerPage = isMobile ? 1 : 2;

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev > 0 ? prev - itemsPerPage : scenarios.length - itemsPerPage));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + itemsPerPage < scenarios.length ? prev + itemsPerPage : 0));
  };

  const isFirstPage = currentIndex === 0;
  const isLastPage = currentIndex + itemsPerPage >= scenarios.length;
  const visibleScenarios = scenarios.slice(currentIndex, currentIndex + itemsPerPage);

  if (isLoading) {
    return <SkeletonCard variant="default" />;
  }

  return (
    <div className="bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] p-6 lg:p-8">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg lg:text-[24px] font-bold text-[#020105] mb-2">
            추천하는 평행 시나리오
          </h2>
          <p className="text-sm lg:text-[16px] text-[#303030]">
            이런 선택들이 당신의 하루를 더 풍요롭게 만들 수 있어요,
          </p>
        </div>
        {/* 네비게이션 버튼 */}
        {!error && scenarios.length > 0 && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handlePrev}
              disabled={isFirstPage}
              className="w-8 h-8 rounded-full bg-[#e8e8e8] flex items-center justify-center transition-colors hover:bg-[#d8d8d8] disabled:hover:bg-[#e8e8e8]"
            >
              <ArrowLeftIcon 
                width={16} 
                height={16} 
                className={isFirstPage ? 'text-[#b4b4b4]' : 'text-[#434343]'}
              />
            </button>
            <button
              onClick={handleNext}
              disabled={isLastPage}
              className="w-8 h-8 rounded-full bg-[#e8e8e8] flex items-center justify-center transition-colors hover:bg-[#d8d8d8] disabled:hover:bg-[#e8e8e8]"
            >
              <ArrowRightIcon 
                width={16} 
                height={16} 
                className={isLastPage ? 'text-[#b4b4b4]' : 'text-[#434343]'}
              />
            </button>
          </div>
        )}
      </div>

      {/* 시나리오 카드들 */}
      <div className="relative overflow-hidden h-[180px]">
        {error ? (
          /* 에러 상태 */
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : scenarios.length === 0 ? (
          /* 빈 상태 */
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500">일기를 작성하면 활동을 추천해드려요</p>
          </div>
        ) : (
          /* 시나리오 슬라이드 */
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              className="flex gap-4 lg:gap-6 absolute inset-0"
              variants={{
                enter: (direction: number) => ({
                  x: direction > 0 ? '100%' : '-100%',
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (direction: number) => ({
                  x: direction > 0 ? '-100%' : '100%',
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'tween', ease: [0.25, 0.1, 0.25, 1], duration: 0.5 },
                opacity: { duration: 0.3 },
              }}
            >
              {visibleScenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  id={scenario.id}
                  emoji={scenario.emoji}
                  title={scenario.title}
                  description={scenario.description}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

