import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';
import ArrowRightIcon from '@/assets/icons/arrow_right.svg?react';

const scenarios = [
  {
    id: 1,
    emoji: '🍕',
    title: '새로운 식당 탐험',
    description: '평소와 다른 길로 출근하면 새로운 카페나 공간을 발견할 수 있어요.',
    score: 20,
  },
  {
    id: 2,
    emoji: '🏃‍♀️',
    title: '다른 길로 출근하기',
    description: '평소와 다른 길로 출근하면 새로운 카페나 공간을 발견할 수 있어요.',
    score: 60,
  },
  {
    id: 3,
    emoji: '📚',
    title: '새로운 책 읽기',
    description: '관심 없던 분야의 책을 읽으면 새로운 시각을 얻을 수 있어요.',
    score: 40,
  },
  {
    id: 4,
    emoji: '🎨',
    title: '새로운 취미 시작',
    description: '늘 하고 싶었던 취미를 시작하면 일상이 풍요로워져요.',
    score: 50,
  },
  {
    id: 5,
    emoji: '🎬',
    title: '영화관 가기',
    description: '주말에 영화를 보면 일상에서 벗어나 힐링할 수 있어요.',
    score: 35,
  },
  {
    id: 6,
    emoji: '🌳',
    title: '공원 산책',
    description: '자연 속을 걸으면 마음이 평온해지고 스트레스가 풀려요.',
    score: 45,
  },
];

export default function ScenarioRecommendCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  return (
    <motion.div
      className="bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] p-6 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
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
      </div>

      {/* 시나리오 카드들 */}
      <div className="relative overflow-hidden h-[180px]">
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
            {visibleScenarios.map((scenario) => {
              const titleColor = scenario.score >= 50 ? '#68a1f2' : '#9e89ff';
              return (
                <div
                  key={scenario.id}
                  className="flex-1 bg-[#090615] rounded-[24px] p-5 lg:p-6 flex flex-col gap-3 lg:gap-4"
                >
                  <h3
                    className="text-lg lg:text-[20px] font-bold"
                    style={{ color: titleColor }}
                  >
                    {scenario.emoji} {scenario.title}
                  </h3>
                  <p className="text-sm lg:text-[16px] text-[#d9d4ff] leading-[1.4] flex-1">
                    {scenario.description}
                  </p>
                  <p className="text-xs lg:text-[14px] text-[#929292]">+ {scenario.score}</p>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

