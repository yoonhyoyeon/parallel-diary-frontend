import { Outlet, useLocation } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import GradientBackground from '@/components/GradientBackground';
import ParticleBackground from '@/components/ParticleBackground';

export default function AuthLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#04030b] flex items-center justify-center px-5 relative overflow-hidden">
      <GradientBackground darkMode={true} />
      <ParticleBackground white={true} />
      
      {/* 메인 컨텐츠 */}
      <div className="relative z-10 flex flex-col w-full max-w-[450px]">
        {/* 자식 라우트 렌더링 with 애니메이션 */}
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </div>
    </div>
  );
}

