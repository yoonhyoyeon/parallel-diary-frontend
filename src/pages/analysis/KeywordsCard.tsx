import { useState, useEffect } from 'react';
import Tag from '@/components/Tag';
import { getTopKeywords } from '@/services/diaryService';
import SkeletonCard from '@/components/SkeletonCard';

export default function KeywordsCard() {
  const [keywords, setKeywords] = useState<Array<{ text: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API로부터 키워드 가져오기
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTopKeywords();
        
        // API 응답을 UI 형식으로 변환
        const formattedKeywords = data.map(item => ({
          text: item.keyword,
          count: item.count,
        }));
        
        setKeywords(formattedKeywords);
      } catch (err) {
        console.error('키워드 조회 실패:', err);
        setError('키워드를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchKeywords();
  }, []);

  if (isLoading) {
    return <SkeletonCard variant="default" />;
  }

  return (
    <div className="bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] p-6 lg:p-8">
      <h2 className="text-lg lg:text-[20px] font-bold text-[#2b2b2b] mb-6">
        자주 등장한 키워드
      </h2>
      
      {error ? (
        /* 에러 상태 */
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : keywords.length === 0 ? (
        /* 빈 상태 */
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-gray-500">일기를 작성하면 키워드가 표시돼요</p>
        </div>
      ) : (
        /* 키워드 태그들 */
        <div className="flex flex-wrap gap-[8px]">
          {keywords.map((keyword, index) => (
            <Tag 
              key={index} 
              text={keyword.text} 
              count={keyword.count}
              variant={index < 4 ? 'primary' : 'secondary'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

