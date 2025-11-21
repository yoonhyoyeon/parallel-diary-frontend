import { Outlet, useLocation } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';
import GradientBackground from '@/components/GradientBackground';

export default function DiaryDetailLayout() {
  const location = useLocation();
  const isParallel = location.pathname.includes('/parallel');
  const bgColor = isParallel ? 'bg-[#261e4c]' : 'bg-white';

  return (
    <motion.div 
      className={`h-screen ${bgColor} relative overflow-hidden`}
      initial={false}
      animate={{ backgroundColor: isParallel ? '#261e4c' : '#ffffff' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="fixed inset-0 z-0">
        <ParticleBackground white={!isParallel} />
        <GradientBackground darkMode={isParallel} />
      </div>
      
      {/* 자식 라우트 렌더링 with 애니메이션 */}
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </motion.div>
  );
}

