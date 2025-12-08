import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { getDiaries } from '@/services/diaryService';
import MonotonyScoreCard from './analysis/MonotonyScoreCard';
import MonotonyTrendCard from './analysis/MonotonyTrendCard';
import KeywordsCard from './analysis/KeywordsCard';
import DiaryStatusCard from './analysis/DiaryStatusCard';
import ScenarioRecommendCard from './analysis/ScenarioRecommendCard';
import DailyTypeCard from './analysis/DailyTypeCard';
import ParticleBackground from '@/components/ParticleBackground';
import GradientBackground from '@/components/GradientBackground';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [addedToBucketList, setAddedToBucketList] = useState<Set<string>>(new Set());
  const [diaryCount, setDiaryCount] = useState<number>(0);
  const [isLoadingDiaries, setIsLoadingDiaries] = useState(true);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setIsLoadingDiaries(true);
        const diaries = await getDiaries();
        setDiaryCount(diaries.length);
      } catch (err) {
        console.error('일기 조회 실패:', err);
      } finally {
        setIsLoadingDiaries(false);
      }
    };

    fetchDiaries();
  }, []);

  const handleAddToBucketList = (id: string) => {
    setAddedToBucketList((prev) => new Set(prev).add(id));
  };

  return (
    <main className="flex justify-center min-h-screen bg-white relative px-4">
      <ParticleBackground />
      <GradientBackground />

      <div className="w-full relative z-10 sm:px-8 lg:px-16 xl:px-24 py-8 lg:py-20 max-w-[1400px]">
        {/* 제목 */}
        <motion.div
          className="flex items-center gap-4 mb-8 lg:mb-15"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <ArrowLeftIcon width={24} height={24} className="text-soft-black" />
          </button>
          <h1 className="text-2xl lg:text-[36px] font-bold text-soft-black">
            나의 일상 분석
          </h1>
        </motion.div>

        {/* 레이아웃 그리드 */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-6">
          {/* 왼쪽 컬럼 */}
          <div className="flex flex-col gap-6 min-w-0">
            <MonotonyScoreCard diaryCount={diaryCount} isLoadingDiaries={isLoadingDiaries} />
            <DailyTypeCard diaryCount={diaryCount} isLoadingDiaries={isLoadingDiaries} />
            <KeywordsCard />
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="flex flex-col gap-6 min-w-0">
            <DiaryStatusCard />
            <MonotonyTrendCard diaryCount={diaryCount} isLoadingDiaries={isLoadingDiaries} />
            <ScenarioRecommendCard
              onAddToBucketList={handleAddToBucketList}
              addedToBucketList={addedToBucketList}
            />
          </div>
        </div>
    </div>
    </main>
  );
}
