import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GuidanceMessage from '@/components/GuidanceMessage';
import Button from '@/components/Button';
import CreateIcon from '@/assets/icons/create.svg?react';
import { generateDiary } from '@/services/diaryService';

interface ReviewStepProps {
  chatMessages: Array<{ role: 'user' | 'assistant'; content: string }>;
  onComplete: (editedContent: string) => void;
  onBack: () => void;
}

export default function ReviewStep({ chatMessages, onComplete, onBack }: ReviewStepProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 현재 날짜와 시간
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  const timeString = currentDate.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  useEffect(() => {
    // API 호출하여 일기 생성
    const fetchDiary = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await generateDiary(chatMessages);
        setContent(response.content);
      } catch (error) {
        console.error('일기 생성 중 오류:', error);
        setError('일기를 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiary();
  }, [chatMessages]);

  // 로딩 완료 후 textarea 맨 뒤에 focus
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.focus();
          // 커서를 맨 뒤로 이동
          const length = textarea.value.length;
          textarea.setSelectionRange(length, length);
        }
      }, 300); // 애니메이션 후 focus
    }
  }, [isLoading]);

  const handleSubmit = () => {
    if (content.trim()) {
      onComplete(content);
    }
  };

  return (
      <div className="flex flex-col min-h-screen px-5 py-10 relative z-10 items-center justify-center">
        <div className="max-w-[1030px] w-full mx-auto relative z-10">
        {/* 타이틀 & 서브 타이틀 */}
        <div className="mb-10">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <GuidanceMessage className="mb-3">
                  대화를 기반으로 일기를 생성하고 있어요.<br/>잠시만 기다려주세요.
                </GuidanceMessage>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <GuidanceMessage className="mb-3 text-red-500">
                  {error}
                </GuidanceMessage>
              </motion.div>
            ) : (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <GuidanceMessage className="mb-3">
                  일기 생성이 완료됐어요!<br/>생성된 일기를 확인하고 수정해보세요.
                </GuidanceMessage>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* 콘텐츠 박스 */}
        <div className="bg-white rounded-[36px] shadow-[0px_0px_30px_0px_rgba(0,0,0,0.06)] min-h-[610px] mb-10">
          {isLoading ? (
            // 로딩 상태
            <div className="p-16">
              <p 
                className="text-xl font-semibold bg-linear-to-r from-[#7463ed] to-[#261e4c] bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% auto',
                  animation: 'gradient-flow 3s ease infinite'
                }}
              >
                일기 생성하는 중 ...
              </p>
            </div>
          ) : (
            // 일기 확인 상태
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="p-[60px] pt-[50px]"
            >
              {/* 날짜와 시간 */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <p className="text-base text-gray-500">
                  {dateString} • {timeString}
                </p>
              </div>
              
          <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[420px] text-[18px] text-[#181818] leading-[1.6] resize-none outline-none bg-transparent"
            placeholder="일기 내용을 확인하고 수정하세요..."
          />
            </motion.div>
          )}
        </div>

        {/* 버튼 - 일기 확인 상태일 때만 표시 */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center items-center gap-4"
          >
            <Button 
              variant="secondary" 
              onClick={onBack}
            >
              다시 대화하기
            </Button>

            {error ? (
              <Button 
                variant="primary" 
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  // useEffect가 다시 실행되도록 chatMessages를 재설정
                  const fetchDiary = async () => {
                    try {
                      setIsLoading(true);
                      setError(null);
                      
                      const response = await generateDiary(chatMessages);
                      setContent(response.content);
                    } catch (error) {
                      console.error('일기 생성 중 오류:', error);
                      setError('일기를 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.');
                    } finally {
                      setIsLoading(false);
                    }
                  };
                  fetchDiary();
                }}
              >
                다시 시도
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                disabled={!content.trim()}
                icon={{ component: <CreateIcon color='#ffffff' width={18} height={18} />, position: 'left' }}
              >
                평행일기 생성하기
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

