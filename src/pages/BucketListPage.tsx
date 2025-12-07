import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';
import GradientBackground from '@/components/GradientBackground';
import Toast from '@/components/Toast';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';
import ScenarioCard from '@/components/ScenarioCard';
import SkeletonCard from '@/components/SkeletonCard';
import ScenarioRecommendCard from '@/pages/analysis/ScenarioRecommendCard';
import { getRecommendedActivities, toggleBucketList } from '@/services/diaryService';

interface BucketListItem {
  id: string;
  emoji: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function BucketListPage() {
  const [bucketListItems, setBucketListItems] = useState<Array<BucketListItem>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToBucketList, setAddedToBucketList] = useState<Set<string>>(new Set());
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [removedItem, setRemovedItem] = useState<{ id: string; emoji: string; title: string; description: string } | null>(null);

  // API로부터 버킷리스트 가져오기
  useEffect(() => {
    const fetchBucketList = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getRecommendedActivities();
        
        // bucket: true인 활동만 필터링 (버킷리스트)
        const bucketItems = data
          .filter((activity) => activity.bucket)
          .map((activity) => ({
            id: activity.id,
            emoji: activity.emoji,
            title: activity.title,
            description: activity.content,
            createdAt: activity.createdAt,
          }));
        
        setBucketListItems(bucketItems);
        setAddedToBucketList(new Set(bucketItems.map((item) => item.id)));
      } catch (err) {
        console.error('버킷리스트 조회 실패:', err);
        setError('버킷리스트를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBucketList();
  }, []);

  const handleAddToBucketList = (
    id: string,
    item?: { id: string; emoji: string; title: string; description: string }
  ) => {
    // ScenarioCard에서 API 호출 및 토스트 처리
    // 여기서는 로컬 상태만 업데이트
    if (item && !bucketListItems.find((bucketItem) => bucketItem.id === id)) {
      setBucketListItems((prev) => [
        {
          id: item.id,
          emoji: item.emoji,
          title: item.title,
          description: item.description,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
    setAddedToBucketList((prev) => new Set(prev).add(id));
  };

  const handleRemoveFromBucketList = (item: { id: string; emoji: string; title: string; description: string }) => {
    // 상태 업데이트로 ScenarioRecommendCard에 전달
    setRemovedItem(item);
    // 즉시 초기화하여 다음 삭제에도 작동하도록
    setTimeout(() => setRemovedItem(null), 100);
  };

  const handleDelete = async (id: string) => {
    try {
      // 삭제 중 상태 추가 (애니메이션 트리거)
      setDeletingItems((prev) => new Set(prev).add(id));
      
      // 삭제할 항목 정보 저장
      const deletedItem = bucketListItems.find((item) => item.id === id);
      
      // API 호출: bucket 값을 토글 (true -> false)
      await toggleBucketList(id);
      
      // 성공 토스트 표시
      setToast({ message: '버킷리스트에서 삭제되었습니다', type: 'success' });
      
      // 애니메이션 시간만큼 대기 (0.5초)
      setTimeout(() => {
        // 로컬 상태 업데이트
        setBucketListItems((prev) => prev.filter((item) => item.id !== id));
        setAddedToBucketList((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        setDeletingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        
        // 추천 활동에 다시 추가
        if (deletedItem && handleRemoveFromBucketList) {
          handleRemoveFromBucketList({
            id: deletedItem.id,
            emoji: deletedItem.emoji,
            title: deletedItem.title,
            description: deletedItem.description,
          });
        }
      }, 500);
    } catch (err) {
      console.error('버킷리스트 삭제 실패:', err);
      // 에러 시 삭제 중 상태 제거
      setDeletingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setToast({ message: '버킷리스트 삭제에 실패했습니다', type: 'error' });
    }
  };


  return (
    <div className="min-h-screen bg-white max-w-[1200px] mx-auto py-10 md:py-16 lg:py-[80px] px-4 md:px-6 lg:px-5">
      {/* Toast 알림 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
      
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
            removedFromBucketList={removedItem}
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
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-[20px]"
          >
            <AnimatePresence mode="popLayout">
              {bucketListItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ 
                    opacity: deletingItems.has(item.id) ? 0 : 1, 
                    y: deletingItems.has(item.id) ? -20 : 0, 
                    scale: deletingItems.has(item.id) ? 0.8 : 1,
                  }}
                  exit={{ 
                    opacity: 0,
                    scale: 0.8,
                    y: -20,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    layout: {
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
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
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

