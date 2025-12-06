import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';
import GradientBackground from '@/components/GradientBackground';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';
import ScenarioCard from '@/components/ScenarioCard';
import SkeletonCard from '@/components/SkeletonCard';
import ScenarioRecommendCard from '@/pages/analysis/ScenarioRecommendCard';

interface BucketListItem {
  id: string;
  emoji: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
}

// 더미 데이터
const dummyBucketListItems: Array<BucketListItem> = [
  {
    id: '115',
    emoji: '🎨',
    title: '미술관 방문하기',
    description: '평소에 가보고 싶었던 미술관을 방문하여 작품들을 감상하고, 카페에서 여유롭게 시간을 보내는 하루를 만들어보세요.',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '103',
    emoji: '☕',
    title: '새로운 카페 탐방',
    description: '한 번도 가보지 않은 동네의 숨겨진 카페를 찾아가서 특별한 커피와 디저트를 맛보며 새로운 분위기를 경험해보세요.',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    emoji: '📚',
    title: '독서 모임 참여',
    description: '관심 있는 주제의 독서 모임에 참여하여 같은 관심사를 가진 사람들과 책에 대해 이야기하고 새로운 인사이트를 얻어보세요.',
    isCompleted: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '101',
    emoji: '🌳',
    title: '공원 산책하기',
    description: '날씨 좋은 날 가까운 공원을 산책하며 자연을 만끽하고, 벤치에 앉아 여유롭게 주변 풍경을 감상하는 시간을 가져보세요.',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    emoji: '🎵',
    title: '라이브 공연 관람',
    description: '좋아하는 아티스트의 라이브 공연을 관람하여 음악의 생생한 감동을 느끼고, 공연장의 특별한 분위기를 경험해보세요.',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    emoji: '🍳',
    title: '새로운 요리 도전',
    description: '한 번도 만들어보지 않은 요리를 레시피를 보며 도전해보고, 완성된 요리를 가족이나 친구들과 함께 나눠 먹어보세요.',
    isCompleted: false,
    createdAt: new Date().toISOString(),
  },
];

export default function BucketListPage() {
  const [bucketListItems, setBucketListItems] = useState<Array<BucketListItem>>(dummyBucketListItems);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [addedToBucketList, setAddedToBucketList] = useState<Set<string>>(
    new Set(dummyBucketListItems.map((item) => item.id))
  );

  const handleAddToBucketList = (
    id: string,
    item?: { id: string; emoji: string; title: string; description: string }
  ) => {
    // 추천 활동에서 버킷리스트에 추가
    if (item && !bucketListItems.find((bucketItem) => bucketItem.id === id)) {
      setBucketListItems((prev) => [
        ...prev,
        {
          id: item.id,
          emoji: item.emoji,
          title: item.title,
          description: item.description,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    setAddedToBucketList((prev) => new Set(prev).add(id));
  };

  const handleDelete = (id: string) => {
    setBucketListItems((prev) => prev.filter((item) => item.id !== id));
    setAddedToBucketList((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };


  return (
    <div className="min-h-screen bg-white max-w-[1200px] mx-auto py-10 md:py-16 lg:py-[80px] px-4 md:px-6 lg:px-5">
      <div className="fixed inset-0 z-0">
        <ParticleBackground />
        <GradientBackground />
      </div>
      <div className="relative z-10">
        {/* 헤더와 뒤로가기 버튼 */}
        <motion.div 
          className="flex items-center gap-3 md:gap-4 mb-6 md:mb-[27px]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/diaries" search={{ tab: 'date' as const, date: undefined }} className="flex items-center justify-center hover:opacity-70 transition-opacity">
            <ArrowLeftIcon width={20} height={20} className="text-soft-black md:w-6 md:h-6" />
          </Link>
          <h1 className="text-xl md:text-2xl lg:text-[36px] font-bold text-black">버킷리스트</h1>
        </motion.div>

        {/* 추천 활동 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4"
        >
          <ScenarioRecommendCard
            title="추천 활동"
            description="버킷리스트에 추가하고 싶은 활동을 선택해보세요"
            onAddToBucketList={handleAddToBucketList}
            addedToBucketList={addedToBucketList}
            variant="bucketlist"
          />
        </motion.div>

        {/* 버킷리스트 개수 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1],
            delay: 0.2
          }}
          className="mb-6 md:mb-8 lg:mb-10"
        >
          <h2 className="text-xl md:text-2xl lg:text-[28px] font-bold text-soft-black mb-2">
            내 버킷리스트
          </h2>
          <span className="text-base md:text-[18px]">
            <span className="font-bold text-[#745ede]">{bucketListItems.length}개</span>
            <span className="font-medium text-[#595959]">의 버킷리스트</span>
          </span>
        </motion.div>

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-[20px]">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} variant="default" />
            ))}
          </div>
        ) : error ? (
          /* 에러 상태 */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-[400px]"
          >
            <p className="text-[12px] md:text-xl text-red-500">{error}</p>
          </motion.div>
        ) : bucketListItems.length === 0 ? (
          /* 빈 상태 */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-6 mt-10"
          >
            <div className="text-center">
              <h1 className="text-[#595959] text-[20px] md:text-[24px] lg:text-[30px] font-bold mb-2">
                버킷리스트가 비어있어요
              </h1>
              <p className="text-sm md:text-base text-gray-500 my-4">
                추천 활동을 버킷리스트에 추가해보세요!
              </p>
            </div>
          </motion.div>
        ) : (
          /* 버킷리스트 카드 그리드 */
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.15,
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-[20px]"
          >
            {bucketListItems.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 15, scale: 0.96 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  }
                }}
              >
                <ScenarioCard
                  id={item.id}
                  emoji={item.emoji}
                  title={item.title}
                  description={item.description}
                  variant="white"
                  enableDetailLink={true}
                  onDelete={(id) => {
                    handleDelete(id);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

