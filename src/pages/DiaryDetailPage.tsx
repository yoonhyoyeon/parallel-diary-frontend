import { useParams, useNavigate, useSearch } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import ConversionIcon from '@/assets/icons/conversion.svg?react';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';
import DiaryDetailSkeleton from '@/components/DiaryDetailSkeleton';
import { getDiary, type Diary } from '@/services/diaryService';

export default function DiaryDetailPage() {
  const { id } = useParams({ from: '/protected/diaries/$id/' });
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const fromCreate = search.fromCreate === 1;
  
  const [diary, setDiary] = useState<Diary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // API로부터 일기 데이터 가져오기
  useEffect(() => {
    const fetchDiary = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDiary(id);
        setDiary(data);
      } catch (err) {
        console.error('일기 조회 실패:', err);
        setError('일기를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiary();
  }, [id]);
  
  if (!diary && !isLoading && !error) {
    return null;
  }

  // 날짜와 시간 포맷팅
  const dateString = diary ? new Date(diary.writtenAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }) : '';
  const timeString = diary ? new Date(diary.writtenAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) : '';

  return (
    <div className="min-h-screen max-w-[1030px] mx-auto px-4 md:px-6 lg:px-5 py-6 md:py-8 lg:py-10 flex flex-col">
        {/* 헤더 - 타이틀과 뒤로가기 버튼 */}
        {!fromCreate && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 lg:mb-10 shrink-0"
          >
            <button 
              onClick={() => window.history.back()}
              className="flex items-center"
            >
              <ArrowLeftIcon width={18} height={18} className="text-[#090615]" />
            </button>
            <h1 className="text-xl md:text-2xl lg:text-[30px] font-bold text-soft-black">원본 일기</h1>
          </motion.div>
        )}

        {/* 일기 콘텐츠 박스 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl md:rounded-3xl lg:rounded-[36px] shadow-[0px_0px_30px_0px_rgba(0,0,0,0.06)] flex-1 flex flex-col mb-[120px]"
        >
          {isLoading ? (
            /* 로딩 상태 */
            <DiaryDetailSkeleton />
          ) : error ? (
            /* 에러 상태 */
            <div className="flex items-center justify-center flex-1">
              <p className="text-base md:text-lg text-red-500">{error}</p>
            </div>
          ) : diary ? (
            /* 일기 내용 */
            <div className="p-6 md:p-10 lg:p-[60px] lg:pt-[50px] flex flex-col flex-1">
              {/* 날짜와 시간 */}
              <div className="pb-3 md:pb-4 border-b border-gray-200 shrink-0">
                <p className="text-sm md:text-base text-gray-500">
                  {dateString} • {timeString}
                </p>
              </div>
              
              {/* 일기 내용 */}
              <div className="w-full flex-1 overflow-y-auto text-base md:text-[17px] lg:text-[18px] text-[#181818] leading-[160%] pr-2 py-4 md:py-5 lg:py-6 break-words">
                {diary.content}
              </div>

              {/* 주요 순간들 - 하단 고정 */}
              {diary.keywords && diary.keywords.length > 0 && (
                <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 shrink-0 pt-4 md:pt-5 lg:pt-6 border-t border-gray-200">
                  <p className="text-base md:text-[17px] lg:text-[18px] font-bold text-black">주요 순간들</p>
                  <div className="flex gap-2 md:gap-3 flex-wrap">
                    {diary.keywords.map((keyword, index) => (
                      <div
                        key={index}
                        className="bg-[#eae8ff] flex items-center justify-center px-4 md:px-5 py-2 md:py-3 rounded-lg"
                      >
                        <p className="text-sm md:text-[15px] lg:text-[16px] font-bold text-[#745ede] whitespace-nowrap">
                          {keyword}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </motion.div>

        {/* 버튼 영역 - 하단 고정 */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent md:bg-none pt-8 pb-6 px-4 md:px-6 z-50">
          <div className="max-w-[1030px] mx-auto flex flex-col sm:flex-row justify-center gap-3">
          {/* Create에서 온 경우 목록으로 버튼 */}
          {fromCreate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="w-full sm:w-auto"
            >
              <Button 
                variant="secondary" 
                onClick={() => {
                  navigate({
                    to: '/diaries',
                    search: { tab: 'all', date: undefined },
                  });
                }}
                className="w-full sm:w-auto"
              >
                일기목록으로 이동
              </Button>
            </motion.div>
          )}

          {/* 평행일기 보기 버튼 */}
          {!isLoading && diary?.parallelDiary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="w-full sm:w-auto"
            >
              <Button 
                variant="primary" 
                onClick={() => {
                  navigate({
                    to: '/diaries/$id/parallel',
                    params: { id: diary.parallelDiary!.id },
                    search: { fromCreate: fromCreate ? 1 : undefined },
                    replace: true,
                  });
                }} 
                icon={{ component: <ConversionIcon width={18} height={18} />, position: 'right' }}
                className="w-full sm:w-auto"
              >
                평행일기 보기
              </Button>
            </motion.div>
          )}
          </div>
        </div>
    </div>
  );
}
