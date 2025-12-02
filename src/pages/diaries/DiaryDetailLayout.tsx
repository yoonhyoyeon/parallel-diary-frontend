import { Outlet, useLocation, useSearch } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';
import GradientBackground from '@/components/GradientBackground';
import GuidanceMessage from '@/components/GuidanceMessage';

export default function DiaryDetailLayout() {
  const location = useLocation();
  const search = useSearch({ strict: false });
  const isParallel = location.pathname.includes('/parallel');
  const fromCreate = search.fromCreate === 1;
  const bgColor = isParallel ? 'bg-[#261e4c]' : 'bg-white';

  return (
    <motion.div 
      className={`h-screen ${bgColor} relative overflow-hidden flex flex-col`}
      initial={false}
      animate={{ backgroundColor: isParallel ? '#261e4c' : '#ffffff' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="fixed inset-0 z-0">
        <ParticleBackground white={!isParallel} />
        <GradientBackground darkMode={isParallel} />
      </div>
      
      {/* 자식 라우트 렌더링 with 애니메이션 */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto">
        {fromCreate && (
          <AnimatePresence mode="wait">
            <div className="mt-20">
              <GuidanceMessage key={location.pathname}>
                평행일기가 생성되었어요!
              </GuidanceMessage>
            </div>
          </AnimatePresence>
        )}
        <Outlet />
      </div>
    </motion.div>
  );
}

