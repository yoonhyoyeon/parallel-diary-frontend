import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Lightbulb, MapPin, Sparkles, Tag } from 'lucide-react';
import type { ActivityDetailData, PlaceSearchKeyword } from '@/services/openaiService';
import type { NaverPlace } from '@/services/naverLocalService';
import ParticleBackground from '@/components/ParticleBackground';
import GradientBackground from '@/components/GradientBackground';
import Toast from '@/components/Toast';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';
import Button from '@/components/Button';
import { useActivityDetail, useActivityStatus } from '@/contexts/ActivityDetailContext';
import { generateActivityDetail } from '@/services/openaiService';
import { searchMultipleKeywords } from '@/services/naverLocalService';
import { getRecommendedActivities, toggleBucketList } from '@/services/diaryService';

export default function ActivityDetailPage() {
  const params = useParams({ strict: false });
  const id = params.id as string;
  const navigate = useNavigate();
  const activityDetailContext = useActivityDetail();
  const currentStatus = useActivityStatus(id); // 상태 자동 구독
  const [activityDetail, setActivityDetail] = useState<ActivityDetailData | null>(null);
  const [recommendedPlaces, setRecommendedPlaces] = useState<Array<NaverPlace & { reason?: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddedToBucketList, setIsAddedToBucketList] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!id) {
      setError('활동 ID가 없습니다.');
      setIsLoading(false);
      return;
    }
    loadActivityDetail();
    checkIfInBucketList();
  }, [id]);

  const checkIfInBucketList = async () => {
    try {
      const activities = await getRecommendedActivities();
      const activity = activities.find((a) => a.id === id);
      if (activity && activity.bucket) {
        setIsAddedToBucketList(true);
      }
    } catch (err) {
      console.error('버킷리스트 상태 확인 실패:', err);
    }
  };

  const handleAddToBucketList = async () => {
    try {
      await toggleBucketList(id);
      setIsAddedToBucketList(true);
      setToast({ message: '버킷리스트에 추가했어요!', type: 'success' });
    } catch (err) {
      console.error('버킷리스트 추가 실패:', err);
      setToast({ message: '버킷리스트 추가에 실패했습니다', type: 'error' });
    }
  };

  const handleRemoveFromBucketList = async () => {
    try {
      await toggleBucketList(id);
      setIsAddedToBucketList(false);
      setToast({ message: '버킷리스트에서 삭제했어요', type: 'success' });
    } catch (err) {
      console.error('버킷리스트 삭제 실패:', err);
      setToast({ message: '버킷리스트 삭제에 실패했습니다', type: 'error' });
    }
  };

  const loadActivityDetail = async () => {
    let shouldResetLoading = true;
    
    try {
      setIsLoading(true);
      setError(null);

      // 1. 전역 상태에서 확인
      if (currentStatus.type === 'complete') {
        // 완료된 데이터 즉시 표시
        const cachedDetail = currentStatus.data;
        setActivityDetail(cachedDetail);
        
        // 캐시된 장소 정보가 있으면 바로 사용
        if (cachedDetail.recommendedPlaces && cachedDetail.recommendedPlaces.length > 0) {
          setRecommendedPlaces(cachedDetail.recommendedPlaces);
          setIsLoading(false);
          return;
        }
        
        // 캐시된 장소가 없으면 키워드로 검색
        if (cachedDetail.placeSearchKeywords?.length) {
          const keywords = cachedDetail.placeSearchKeywords.map((kw: string | PlaceSearchKeyword) => 
            typeof kw === 'string' ? kw : kw.keyword
          );
          const places = await searchMultipleKeywords(keywords);
          
          // 추천 이유 매핑
          const placesWithReason = places.map((place, index) => {
            const keywordObj = cachedDetail.placeSearchKeywords![index];
            return {
              ...place,
              reason: typeof keywordObj === 'object' ? keywordObj.reason : undefined
            };
          });
          
          setRecommendedPlaces(placesWithReason);
          
          // 검색 결과를 전역 상태에 업데이트
          const updatedDetail = { ...cachedDetail, recommendedPlaces: places };
          activityDetailContext.setComplete(id, updatedDetail);
          setActivityDetail(updatedDetail);
        }
        
        setIsLoading(false);
        return;
      }

      if (currentStatus.type === 'loading') {
        // 다른 곳에서 이미 생성 중 → 대기
        console.log('⏳ 다른 곳에서 생성 중... 대기합니다');
        setIsGenerating(true);
        setIsLoading(true);
        shouldResetLoading = false; // Context 업데이트 시 자동 처리
        return;
      }

      if (currentStatus.type === 'error') {
        // 이전에 실패한 경우 → 재시도
        console.log('⚠️ 이전 요청이 실패했습니다. 재시도합니다.');
      }

      // 2. 데이터 없음 → 새로 생성
      setIsGenerating(true);
      activityDetailContext.setLoading(id);
      
      const activities = await getRecommendedActivities();
      const activity = activities.find((a) => a.id === id);

      if (!activity) {
        throw new Error('활동을 찾을 수 없습니다.');
      }

      // 3. GPT API로 상세 정보 생성
      const generatedDetail = await generateActivityDetail({
        id: activity.id,
        emoji: activity.emoji,
        title: activity.title,
        description: activity.content,
      });

      // 4. 생성된 키워드로 네이버 장소 검색
      let placesWithReason: Array<NaverPlace & { reason?: string }> = [];
      if (generatedDetail.placeSearchKeywords?.length) {
        const keywords = generatedDetail.placeSearchKeywords.map((kw: string | PlaceSearchKeyword) => 
          typeof kw === 'string' ? kw : kw.keyword
        );
        const places = await searchMultipleKeywords(keywords);
        
        // 추천 이유 매핑
        placesWithReason = places.map((place, index) => {
          const keywordObj = generatedDetail.placeSearchKeywords![index];
          return {
            ...place,
            reason: typeof keywordObj === 'object' ? keywordObj.reason : undefined
          };
        });
        
        setRecommendedPlaces(placesWithReason);
      }

      // 5. 전역 상태에 저장
      const detailWithPlaces = { ...generatedDetail, recommendedPlaces: placesWithReason };
      activityDetailContext.setComplete(id, detailWithPlaces);
      setActivityDetail(detailWithPlaces);
    } catch (err) {
      console.error('활동 상세 정보 로드 실패:', err);
      activityDetailContext.setError(id, err instanceof Error ? err.message : String(err));
      setError(err instanceof Error ? err.message : '활동 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      if (shouldResetLoading) {
        setIsLoading(false);
        setIsGenerating(false);
      }
    }
  };

  // Context 상태 변화 자동 감지 (useActivityStatus 덕분에 자동 리렌더링)
  useEffect(() => {
    if (!id) return;
    
    if (currentStatus.type === 'complete') {
      // 완료됨 → 데이터 표시
      const detail = currentStatus.data;
      if (!activityDetail || activityDetail.id !== detail.id) {
        setActivityDetail(detail);
        
        if (detail.recommendedPlaces && detail.recommendedPlaces.length > 0) {
          setRecommendedPlaces(detail.recommendedPlaces);
        }
        
        setIsGenerating(false);
        setIsLoading(false);
      }
    } else if (currentStatus.type === 'error') {
      // 에러 발생
      setError(currentStatus.error);
      setIsGenerating(false);
      setIsLoading(false);
    } else if (currentStatus.type === 'loading') {
      // 로딩 중 상태 유지
      setIsGenerating(true);
      setIsLoading(true);
    }
  }, [currentStatus, id, activityDetail]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '쉬움':
        return 'text-green-500 bg-green-50';
      case '보통':
        return 'text-yellow-500 bg-yellow-50';
      case '어려움':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white max-w-[1200px] mx-auto py-10 md:py-16 lg:py-[80px] px-4 md:px-6 lg:px-5">
        <div className="fixed inset-0 z-0">
          <ParticleBackground />
          <GradientBackground />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
          {/* 친근한 로딩 애니메이션 */}
          <div className="flex gap-2 mb-6">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-4 h-4 bg-[#745ede] rounded-full"
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#595959] text-base md:text-lg font-medium"
          >
            해당 활동의 상세 정보를 찾고있어요!
          </motion.p>
          {isGenerating && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-[#9e89ff] text-sm md:text-base"
            >
              AI가 맞춤 정보를 생성하는 중...
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  if (error || !activityDetail) {
    return (
      <div className="min-h-screen bg-white max-w-[1200px] mx-auto py-10 md:py-16 lg:py-[80px] px-4 md:px-6 lg:px-5">
        <div className="fixed inset-0 z-0">
          <ParticleBackground />
          <GradientBackground />
        </div>
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 md:gap-4 mb-6"
          >
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <ArrowLeftIcon width={20} height={20} className="text-soft-black md:w-6 md:h-6" />
            </button>
            <h1 className="text-xl md:text-2xl lg:text-[36px] font-bold text-black">활동 상세</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[400px]"
          >
            <p className="text-red-500 mb-4">{error || '활동을 찾을 수 없습니다.'}</p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-[#745ede] text-white rounded-lg hover:bg-[#5d4bc4] transition-colors"
            >
              뒤로 가기
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-[1200px] mx-auto py-10 md:py-16 lg:py-[80px] px-4 md:px-6 lg:px-5">
      {/* Toast 알림 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
          actionText={toast.type === 'success' ? '확인하기' : undefined}
          onActionClick={toast.type === 'success' ? () => navigate({ to: '/bucketlist' }) : undefined}
          duration={toast.type === 'success' ? undefined : 3000}
        />
      )}
      
      <div className="fixed inset-0 z-0">
        <ParticleBackground />
        <GradientBackground />
      </div>
      <div className="relative z-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <ArrowLeftIcon width={20} height={20} className="text-soft-black md:w-6 md:h-6" />
          </button>
          <h1 className="text-xl md:text-2xl lg:text-[36px] font-bold text-black">활동 상세</h1>
        </motion.div>

        {/* 메인 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] p-6 md:p-8 lg:p-10"
        >
          {/* 타이틀 섹션 */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-2xl md:text-3xl lg:text-[40px] font-bold text-[#2b2b2b]">
                {activityDetail.emoji} {activityDetail.title}
              </h2>
              <div className="flex gap-2 shrink-0">
                <span className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium ${getDifficultyColor(activityDetail.difficulty)}`}>
                  {activityDetail.difficulty}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs md:text-sm font-medium text-[#745ede] bg-[#f3f0ff]">
                  {activityDetail.estimatedTime}
                </span>
              </div>
            </div>
            <p className="text-sm md:text-base lg:text-lg text-[#595959] leading-relaxed">
              {activityDetail.description}
            </p>
          </div>

          {/* 상세 설명 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 p-6 bg-gradient-to-br from-[#f8f7ff] to-[#fef9ff] rounded-2xl"
          >
            <h3 className="text-lg md:text-xl font-bold text-[#2b2b2b] mb-3">상세 설명</h3>
            <p className="text-sm md:text-base text-[#434343] leading-relaxed">
              {activityDetail.detailedDescription}
            </p>
          </motion.div>

          {/* 기대 효과 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-lg md:text-xl font-bold text-[#2b2b2b] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#745ede]" />
              기대 효과
            </h3>
            <ul className="space-y-3">
              {activityDetail.benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 text-sm md:text-base text-[#434343]"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#745ede] text-white flex items-center justify-center text-xs font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span className="flex-1">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* 추천 팁 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-lg md:text-xl font-bold text-[#2b2b2b] mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-[#745ede]" />
              추천 팁
            </h3>
            <ul className="space-y-3">
              {activityDetail.tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 text-sm md:text-base text-[#434343]"
                >
                  <span className="flex-shrink-0 text-[#745ede] text-lg">•</span>
                  <span className="flex-1">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* 추천 장소 */}
          {recommendedPlaces.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h3 className="text-lg md:text-xl font-bold text-[#2b2b2b] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#745ede]" />
                추천 장소
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedPlaces.map((place, index) => {
                  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(place.title)}`;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-gradient-to-br from-[#f8f7ff] to-[#fef9ff] rounded-2xl p-4 lg:p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-base md:text-lg font-bold text-[#2b2b2b] mb-1">
                            {place.title}
                          </h4>
                          <span className="inline-block px-2 py-1 bg-[#745ede]/10 text-[#745ede] rounded-full text-xs font-medium mb-2">
                            {place.category.split('>').pop()?.trim() || place.category}
                          </span>
                        </div>
                      </div>
                      {place.reason && (
                        <p className="text-xs md:text-sm text-[#745ede] mb-2 font-medium">
                          💡 {place.reason}
                        </p>
                      )}
                      <p className="text-xs md:text-sm text-[#595959] mb-2">
                        {place.roadAddress || place.address}
                      </p>
                      {place.description && (
                        <p className="text-xs md:text-sm text-[#434343] mb-3 leading-relaxed">
                          {place.description}
                        </p>
                      )}
                      <a
                        href={naverMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#03C75A] text-white rounded-lg text-xs font-medium hover:bg-[#02b350] transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        네이버 지도
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 태그 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6"
          >
            <h3 className="text-lg md:text-xl font-bold text-[#2b2b2b] mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 md:w-6 md:h-6 text-[#745ede]" />
              관련 태그
            </h3>
            <div className="flex flex-wrap gap-2">
              {activityDetail.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="px-4 py-2 bg-[#e8e8e8] text-[#434343] rounded-full text-xs md:text-sm font-medium hover:bg-[#d8d8d8] transition-colors"
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* 버킷리스트 추가 버튼 또는 추가됨 표시 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center gap-4"
          >
            {isAddedToBucketList ? (
              <>
                <div className="flex items-center gap-2 px-6 py-3 bg-[#f3f0ff] rounded-2xl">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#745ede]">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm md:text-base font-medium text-[#745ede]">
                    버킷리스트에 추가된 활동이에요.
                  </span>
                </div>
                <button
                  onClick={handleRemoveFromBucketList}
                  className="text-sm text-[#9ca3af] hover:text-red-500 transition-colors underline"
                >
                  버킷리스트에서 삭제
                </button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={handleAddToBucketList}
                className="w-full sm:w-auto"
              >
                버킷리스트에 추가
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

