import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, MapPin, Tag } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import GradientBackground from '@/components/GradientBackground';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';
import Button from '@/components/Button';
import { getActivityDetailById, saveActivityDetailById, hasActivityDetail } from '@/services/activityDetailStorage';
import { generateActivityDetail, type ActivityDetailData } from '@/services/openaiService';
import { getRecommendedActivities } from '@/services/diaryService';

export default function ActivityDetailPage() {
  const params = useParams({ strict: false });
  const id = params.id as string;
  const navigate = useNavigate();
  const [activityDetail, setActivityDetail] = useState<ActivityDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('활동 ID가 없습니다.');
      setIsLoading(false);
      return;
    }
    loadActivityDetail();
  }, [id]);

  const loadActivityDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. localStorage에서 확인
      if (hasActivityDetail(id)) {
        const cachedDetail = getActivityDetailById(id);
        if (cachedDetail) {
          setActivityDetail(cachedDetail);
          setIsLoading(false);
          return;
        }
      }

      // 2. localStorage에 없으면 API로 활동 기본 정보 가져오기
      setIsGenerating(true);
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

      // 4. localStorage에 저장
      saveActivityDetailById(id, generatedDetail);
      setActivityDetail(generatedDetail);
    } catch (err) {
      console.error('활동 상세 정보 로드 실패:', err);
      setError(err instanceof Error ? err.message : '활동 상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

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
              onClick={() => navigate({ to: '/bucketlist' })}
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
              onClick={() => navigate({ to: '/bucketlist' })}
              className="px-6 py-3 bg-[#745ede] text-white rounded-lg hover:bg-[#5d4bc4] transition-colors"
            >
              버킷리스트로 돌아가기
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-[1200px] mx-auto py-10 md:py-16 lg:py-[80px] px-4 md:px-6 lg:px-5">
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
            onClick={() => navigate({ to: '/bucketlist' })}
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
          {activityDetail.recommendedPlaces && activityDetail.recommendedPlaces.length > 0 && (
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
                {activityDetail.recommendedPlaces.map((place, index) => {
                  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(place.name + ' ' + place.address)}`;
                  const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`;
                  
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
                            {place.name}
                          </h4>
                          <span className="inline-block px-2 py-1 bg-[#745ede]/10 text-[#745ede] rounded-full text-xs font-medium mb-2">
                            {place.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-[#595959] mb-2">{place.address}</p>
                      <p className="text-xs md:text-sm text-[#434343] mb-3 leading-relaxed">
                        {place.description}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={naverMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#03C75A] text-white rounded-lg text-xs md:text-sm font-medium hover:bg-[#02b350] transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          네이버 지도
                        </a>
                        <a
                          href={googleMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#4285F4] text-white rounded-lg text-xs md:text-sm font-medium hover:bg-[#3367D6] transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          구글 지도
                        </a>
                      </div>
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
        </motion.div>

        {/* 버튼 그룹 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            variant="secondary"
            onClick={() => navigate({ to: '/bucketlist' })}
            className="w-full sm:w-auto"
          >
            버킷리스트로 돌아가기
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // 버킷리스트에 추가하는 로직은 나중에 구현 가능
              alert('버킷리스트에 추가되었습니다!');
            }}
            className="w-full sm:w-auto"
          >
            버킷리스트에 추가
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

