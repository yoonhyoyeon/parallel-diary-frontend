import { useParams, useNavigate, useSearch } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import ConversionIcon from '@/assets/icons/conversion.svg?react';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';
import ScenarioCard from '@/components/ScenarioCard';
import { getParallelDiary, type ParallelDiaryDetail } from '@/services/diaryService';

export default function ParallelDetailPage() {
  const { id } = useParams({ from: '/protected/diaries/$id/parallel' });
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const fromCreate = search.fromCreate === 1;

  const [parallelDiary, setParallelDiary] = useState<ParallelDiaryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToBucketList, setAddedToBucketList] = useState<Set<string>>(new Set());
  
  // API로부터 평행일기 데이터 가져오기
  useEffect(() => {
    const fetchParallelDiary = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getParallelDiary(id);
        setParallelDiary(data);
      } catch (err) {
        console.error('평행일기 조회 실패:', err);
        setError('평행일기를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchParallelDiary();
  }, [id]);
  
  if (!parallelDiary && !isLoading && !error) {
    return null;
  }

  // 날짜와 시간 포맷팅 (원본 일기의 날짜 사용)
  const dateString = parallelDiary ? new Date(parallelDiary.diary.writtenAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }) : '';
  const timeString = parallelDiary ? new Date(parallelDiary.diary.writtenAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) : '';

  const handleAddToBucketList = (activityId: string) => {
    // 로컬 상태만 업데이트 (UI만)
    setAddedToBucketList((prev) => new Set(prev).add(activityId));
  };

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
            <ArrowLeftIcon width={18} height={18} className="text-white" />
          </button>
          <h1 className="text-xl md:text-2xl lg:text-[36px] font-bold text-white">평행일기</h1>
        </motion.div>
      )}

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-5 lg:gap-6 mb-[120px] min-h-0">
        {/* 왼쪽: 일기 콘텐츠 (원본 일기 레이아웃, Figma 프레임 색상) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#100b27] rounded-2xl md:rounded-3xl lg:rounded-[36px] flex-1 flex flex-col min-h-[400px]"
        >
          {isLoading ? (
            /* 로딩 상태 - 다크 테마 스켈레톤 */
            <div className="p-6 md:p-10 lg:p-[60px] lg:pt-[50px] flex flex-col flex-1">
              <div className="pb-3 md:pb-4 border-b border-[rgba(198,198,198,0.2)] shrink-0">
                <div className="h-4 md:h-5 w-64 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="flex-1 py-4 md:py-5 lg:py-6 flex flex-col gap-3">
                <div className="h-4 md:h-5 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-4 md:h-5 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-4 md:h-5 w-5/6 bg-white/10 rounded animate-pulse" />
                <div className="h-4 md:h-5 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-4 md:h-5 w-4/5 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ) : error ? (
            /* 에러 상태 */
            <div className="flex items-center justify-center flex-1">
              <p className="text-base md:text-lg text-red-400">{error}</p>
            </div>
          ) : parallelDiary ? (
            /* 평행일기 내용 */
            <div className="p-6 md:p-10 lg:p-[60px] lg:pt-[50px] flex flex-col flex-1 min-h-0">
              {/* 날짜와 시간 */}
              <div className="mb-4 md:mb-5 lg:mb-6 pb-3 md:pb-4 border-b border-[rgba(198,198,198,0.3)] shrink-0">
                <p className="text-sm md:text-base text-[#C6C6C6]">
                  {dateString} • {timeString}
                </p>
              </div>
              
              {/* 일기 내용 - 스크롤 가능 영역 */}
              <div className="w-full flex-1 overflow-y-auto text-base md:text-[17px] lg:text-[18px] text-white leading-[160%] pr-2 break-words">
                {parallelDiary.content}
              </div>
            </div>
          ) : null}
        </motion.div>

        {/* 오른쪽: 주요 순간들 & 색다른 일상 추천 (Figma 프레임) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="bg-[#3a2e72] rounded-2xl md:rounded-[20px] lg:rounded-[24px] w-full lg:w-[395px] flex flex-col min-h-[400px] lg:shrink-0"
        >
          {isLoading ? (
            /* 로딩 상태 - 다크 테마 스켈레톤 */
            <div className="p-5 md:p-6 lg:p-7 flex flex-col gap-4 md:gap-5 flex-1">
              {/* 주요 순간들 스켈레톤 */}
              <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 shrink-0">
                <div className="h-5 md:h-6 w-24 bg-white/10 rounded animate-pulse" />
                <div className="flex gap-2 md:gap-3 flex-wrap">
                  <div className="h-10 w-20 bg-white/10 rounded-lg animate-pulse" />
                  <div className="h-10 w-16 bg-white/10 rounded-lg animate-pulse" />
                  <div className="h-10 w-24 bg-white/10 rounded-lg animate-pulse" />
                </div>
              </div>
              
              {/* 색다른 일상 추천 스켈레톤 */}
              <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 flex-1">
                <div className="h-5 md:h-6 w-32 bg-white/10 rounded animate-pulse" />
                <div className="flex flex-col gap-3">
                  <div className="h-32 w-full bg-white/10 rounded-[24px] animate-pulse" />
                  <div className="h-32 w-full bg-white/10 rounded-[24px] animate-pulse" />
                </div>
              </div>
            </div>
          ) : error ? (
            /* 에러 상태 */
            <div className="flex items-center justify-center flex-1">
              <p className="text-base md:text-lg text-red-400">{error}</p>
            </div>
          ) : parallelDiary ? (
            /* 실제 내용 */
            <div className="p-5 md:p-6 lg:p-7 flex flex-col gap-4 md:gap-5 flex-1 min-h-0">
              {/* 주요 순간들 */}
              {parallelDiary.diary.keywords && parallelDiary.diary.keywords.length > 0 && (
                <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 shrink-0">
                  <p className="text-base md:text-[17px] lg:text-[18px] font-semibold text-white">주요 순간들</p>
                  <div className="flex gap-2 md:gap-3 flex-wrap">
                    {parallelDiary.diary.keywords.map((keyword, index) => (
                      <div
                        key={index}
                        className="bg-[#eae8ff] flex items-center justify-center px-4 md:px-5 py-2 md:py-3 rounded-lg"
                      >
                        <p className="text-sm md:text-[15px] lg:text-[16px] font-bold text-[#745ede] whitespace-nowrap leading-none">
                          {keyword}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 색다른 일상 추천 */}
              {parallelDiary.recommendedActivities && parallelDiary.recommendedActivities.length > 0 && (
                <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 flex-1 min-h-0">
                  <p className="text-base md:text-[17px] lg:text-[18px] font-semibold text-white">색다른 일상 추천</p>
                  <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {parallelDiary.recommendedActivities.map((activity) => (
                      <div key={activity.id} className="shrink-0">
                        <ScenarioCard
                          id={activity.id}
                          emoji={activity.emoji}
                          title={activity.title}
                          description={activity.content}
                          onAddToBucketList={handleAddToBucketList}
                          isInBucketList={addedToBucketList.has(activity.id)}
                          enableDetailLink={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </motion.div>
      </div>

        {/* 버튼 영역 - 하단 고정 */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#090615] via-[#090615]/95 to-transparent md:bg-none pt-8 pb-6 px-4 md:px-6 z-50">
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
                  search: { tab: 'date', date: undefined },
                });
              }}
              className="w-full sm:w-auto"
            >
              일기목록으로 이동
            </Button>
          </motion.div>
        )}
        {/* 원본 일기 보기 버튼 */}
        {!isLoading && parallelDiary && (
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
                  to: '/diaries/$id',
                  params: { id: parallelDiary.diaryId },
                  search: { fromCreate: fromCreate ? 1 : undefined },
                  replace: true,
                });
              }} 
              icon={{ component: <ConversionIcon width={18} height={18} />, position: 'right' }}
              className="w-full sm:w-auto"
            >
              원본일기 보기
            </Button>
          </motion.div>
        )}
          </div>
        </div>
    </div>
  );
}
