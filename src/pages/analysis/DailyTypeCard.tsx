import { useState, useEffect } from 'react';
import DailyTypeDisplay, { type DailyTypeValue } from '@/components/DailyTypeDisplay';
import { getDiaries, classifyDiaryType } from '@/services/diaryService';
import SkeletonCard from '@/components/SkeletonCard';

// API 응답 타입을 프론트 타입으로 매핑
const mapApiTypeToFrontType = (apiType: string): DailyTypeValue | null => {
  switch (apiType) {
    case '새로운 시도형':
      return 'explore';
    case '루틴 충실형':
      return 'routine';
    case '흐름형 (적응형)':
      return 'action';
    case '분류 불가':
      return null; // 분류 불가
    default:
      return null;
  }
};

interface DailyTypeCardProps {
  diaryCount: number;
  isLoadingDiaries: boolean;
}

export default function DailyTypeCard({ diaryCount, isLoadingDiaries }: DailyTypeCardProps) {
  const [dailyType, setDailyType] = useState<DailyTypeValue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API로부터 일상 타입 가져오기
  useEffect(() => {
    const fetchDailyType = async () => {
      // 일기 개수 로딩 중이면 대기
      if (isLoadingDiaries) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // 일기가 3개 미만일 때 에러 표시
        if (diaryCount < 3) {
          setError(diaryCount === 0 ? 'no-diaries' : 'insufficient-data');
          setIsLoading(false);
          return;
        }
        
        // 1. 최근 일기들 가져오기
        const diaries = await getDiaries();
        
        // 2. 일기 내용들을 문장으로 변환
        const sentences = diaries.map(diary => diary.content);
        
        // 3. 일기 타입 분류 API 호출
        const result = await classifyDiaryType(sentences);
        
        // 4. API 응답 타입을 프론트 타입으로 변환
        const mappedType = mapApiTypeToFrontType(result.diary_type);
        
        if (mappedType) {
          setDailyType(mappedType);
        } else {
          // 분류 불가
          setError('classification-failed');
        }
      } catch (err) {
        console.error('일상 타입 조회 실패:', err);
        setError('일상 타입을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDailyType();
  }, [diaryCount, isLoadingDiaries]);

  if (isLoading) {
    return <SkeletonCard variant="type" />;
  }

  return (
    <div>
      <h2 className="text-lg lg:text-[20px] font-bold text-soft-black mb-4 lg:mb-6">
        나의 일상 타입
      </h2>
      
      {error ? (
        /* 에러/분석 불가 상태 */
        <div className="relative bg-linear-to-br from-[#b39fff] via-[#a591ff] to-[#9681ff] rounded-[20px] lg:rounded-[24px] overflow-hidden">
          {/* 내부 그림자 효과 */}
          <div className="absolute inset-0 pointer-events-none shadow-[0px_3px_50.6px_0px_inset_#6343ff]" />
          
          <div className="relative px-6 py-10 lg:px-8 lg:py-12 flex flex-col items-center gap-4 lg:gap-5 text-center">
            {/* 아이콘 */}
            <div className="flex items-center justify-center w-[100px] h-[100px] lg:w-[120px] lg:h-[120px]">
              <span className="text-6xl lg:text-7xl">
                {error === 'no-diaries' || error === 'insufficient-data'
                  ? '🤔'
                  : error === 'classification-failed'
                  ? '🤔'
                  : '⚠️'}
              </span>
            </div>
            
            {/* 메시지 */}
            <div>
              <h3 className="text-lg lg:text-[20px] font-bold text-[#ffffff] mb-2 leading-tight">
                {error === 'no-diaries' || error === 'insufficient-data'
                  ? '데이터가 충분하지 않아요!'
                  : '아직 일상 타입을 분석할 수 없어요!'}
              </h3>
              <p className="text-sm lg:text-[14px] text-[#ffffff] opacity-90 leading-relaxed max-w-[280px] break-keep">
                {error === 'no-diaries' || error === 'insufficient-data'
                  ? '일기를 더 작성하면 분석이 가능해요!'
                  : error === 'classification-failed'
                  ? '일기를 더 작성하면 정확한 분석이 가능해요!'
                  : '잠시 후 다시 시도해주세요!'}
              </p>
            </div>
          </div>
        </div>
      ) : dailyType ? (
        /* 타입 카드 */
        <DailyTypeDisplay type={dailyType} />
      ) : null}
    </div>
  );
}

