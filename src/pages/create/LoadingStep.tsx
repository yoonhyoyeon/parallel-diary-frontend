import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { createIntegratedDiary } from '@/services/diaryService';
import Button from '@/components/Button';

interface LoadingStepProps {
  diaryContent: string;
  onComplete: (parallelDiaryId: string) => void;
}

export default function LoadingStep({ diaryContent, onComplete }: LoadingStepProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const hasCalledRef = useRef(false);

  const createDiary = async () => {
    if (hasCalledRef.current) return; // 이미 호출했으면 무시
    hasCalledRef.current = true;
    
    try {
      // 현재 날짜를 ISO 8601 형식으로 변환
      const now = new Date();
      const writtenAt = now.toISOString();
      
      console.log('일기 생성 요청:', { originalContent: diaryContent.substring(0, 50), writtenAt });
      
      // 일기와 평행일기를 한 번에 생성
      const diary = await createIntegratedDiary(diaryContent, writtenAt);
      
      console.log('일기 생성 성공:', diary);
      
      // 평행일기 ID가 있으면 완료 처리
      if (diary.parallelDiary?.id) {
        const parallelDiaryId = diary.parallelDiary.id;
        onComplete(parallelDiaryId);
        
        // 평행일기 보기 페이지로 리다이렉트 (fromCreate query string 포함)
        navigate({
          to: '/diaries/$id/parallel',
          params: { id: parallelDiaryId },
          search: { fromCreate: 1 },
          replace: true,
        });
      } else {
        setError('평행일기 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('일기 저장 중 오류:', err);
      setError('일기를 저장하는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    createDiary();
  }, []);

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center text-center px-4 md:px-6 lg:px-5 py-6 md:py-8">
      {error ? (
        /* 에러 메시지 */
        <div className="text-white flex flex-col items-center gap-6">
          <div className="text-center">
            <motion.h1
              className="text-xl md:text-2xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              문제가 발생했습니다
            </motion.h1>
            <motion.p
              className="text-sm md:text-base text-red-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {error}
            </motion.p>
          </div>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="primary"
              onClick={() => {
                setError(null);
                hasCalledRef.current = false;
                createDiary();
              }}
            >
              다시 시도
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate({ to: '/' })}
            >
              홈으로 이동
            </Button>
          </motion.div>
        </div>
      ) : (
        /* 포탈 애니메이션 - 가운데 원 */
        <motion.div
          className="relative flex items-center justify-center w-[250px] h-[250px] sm:w-[280px] sm:h-[280px] md:w-[300px] md:h-[300px]"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-[3px] md:border-4 border-white"
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
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8">
            <motion.h1
              className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3"
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
              className="text-white text-sm md:text-base leading-relaxed"
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
      )}
    </div>
  );
}

