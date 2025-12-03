import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import ParticleBackground from '@/components/ParticleBackground';
import GradientBackground from '@/components/GradientBackground';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';
import MonotonyScoreCard from './analysis/MonotonyScoreCard';
import MonotonyTrendCard from './analysis/MonotonyTrendCard';
import KeywordsCard from './analysis/KeywordsCard';
import DiaryStatusCard from './analysis/DiaryStatusCard';
import BehaviorPatternCard from './analysis/BehaviorPatternCard';
import ScenarioRecommendCard from './analysis/ScenarioRecommendCard';

export default function AnalysisPage() {
  const navigate = useNavigate();

  return (
    <main className="flex justify-center min-h-screen bg-white relative px-4">
      <ParticleBackground />
      <GradientBackground />

      <div className="relative z-10 sm:px-8 lg:px-16 xl:px-24 py-8 lg:py-20 max-w-[1400px]">
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
          <h1 className="text-2xl lg:text-[36px] font-bold text-black">
            나의 일상 분석
          </h1>
        </motion.div>

        {/* 레이아웃 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,400px)_1fr] gap-6">
          {/* 왼쪽 컬럼 */}
          <div className="flex flex-col gap-6">
            <MonotonyScoreCard />
            <MonotonyTrendCard />
            <KeywordsCard />
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="flex flex-col gap-6">
            <DiaryStatusCard />
            <BehaviorPatternCard />
            <ScenarioRecommendCard />
          </div>
        </div>
    </div>
    </main>
  );
}
