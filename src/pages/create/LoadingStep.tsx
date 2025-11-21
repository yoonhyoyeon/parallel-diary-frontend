import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';

interface LoadingStepProps {
  diaryContent: string;
  onComplete: (parallelDiaryId: string) => void;
}

export default function LoadingStep({ diaryContent: _diaryContent, onComplete }: LoadingStepProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // 5초 후 완료
    const timer = setTimeout(() => {
      const parallelDiaryId = 'dummy-parallel-diary-id';
      onComplete(parallelDiaryId);
      
      // 평행일기 보기 페이지로 리다이렉트 (fromCreate query string 포함)
      navigate({
        to: '/diaries/$id/parallel',
        params: { id: parallelDiaryId },
        search: { fromCreate: 1 },
        replace: true,
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete, navigate]);

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center text-center p-5">
      {/* 포탈 애니메이션 - 가운데 원 */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: '300px', height: '300px' }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-4 border-white"
            style={{
              opacity: 0.3 - i * 0.1,
            }}
            animate={{
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
        
        {/* 원 안의 텍스트 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <motion.h1
            className="text-2xl font-bold text-white mb-3"
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            평행 세계로 이동 중..
          </motion.h1>

          <motion.p
            className="text-white text-base"
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            다른 선택의 가능성을<br/>탐색하고 있어요!
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

