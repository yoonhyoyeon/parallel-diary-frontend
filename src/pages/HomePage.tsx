import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import logoDesktop from '@/assets/images/home_logo_desktop.png';
import logoMobile from '@/assets/images/home_logo_mobile.png';
import cristal_ball from '@/assets/icons/crystal_ball.png';
import HomeButton from '@/components/HomeButton';
import PlusIcon from '@/assets/icons/plus.svg?react';
import BookIcon from '@/assets/icons/book.svg?react';
import ChartIcon from '@/assets/icons/chart.svg?react';
import ParticleBackground from '@/components/ParticleBackground';
import GradientBackground from '@/components/GradientBackground';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate({ to: '/auth/login' });
  };
  
  const logo = isMobile ? logoMobile : logoDesktop;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-5 bg-white relative overflow-hidden">
      <ParticleBackground />
      <GradientBackground />

      {/* 로그아웃 링크 */}
      <div className="absolute top-6 md:top-8 right-4 md:right-8 z-20 flex items-center gap-2 md:gap-4">
        {user && (
          <span className="text-xs md:text-sm text-gray-600">
            {user.name}님 환영합니다
          </span>
        )}
        <a
          onClick={handleLogout}
          className="text-xs md:text-sm text-gray-400 hover:text-gray-600 underline cursor-pointer transition-colors"
        >
          로그아웃
        </a>
      </div>

      <div className="w-full md:w-[700px] text-center max-w-7xl flex flex-col items-center min-h-screen justify-between relative z-10 mx-auto py-20">
        <motion.img 
          className="w-full max-w-[350px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[600px] px-4 md:px-0 mb-6 md:mb-8" 
          src={logo} 
          alt="Parallel Diary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        
        <motion.div 
          className="bg-white rounded-2xl md:rounded-3xl px-5 py-4 md:px-8 md:py-6 shadow-[2px_5px_30px_rgba(0,0,0,0.08)] -rotate-12 max-w-[90%] md:max-w-none mx-4 md:mx-0 mb-12 md:mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="flex gap-2 mb-2 md:mb-3">
            <img src={cristal_ball} alt="Cristal Ball" className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-base text-[#C2C2C2]">오늘 하루는 어땟나요?</span>
          </div>
          <div className="text-left text-soft-black font-semibold text-base md:text-[18px] pl-1 md:pl-2 leading-relaxed">
            당신의 선택을 기록하고,<br/>만약 달랐다면 어땠을지 상상해봐요.
          </div>
        </motion.div>

        {/* 메뉴 버튼들 */}
        <motion.div 
          className="flex flex-col md:flex-row gap-4 md:gap-6 w-full"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.4,
                staggerChildren: 0.1
              }
            }
          }}
        >
          {/* 일기 쓰기 - 모바일: 전체 너비, 데스크톱: flex-1 */}
          <motion.div 
            className="w-full md:flex-1"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <HomeButton to="/create" icon={<PlusIcon width={20} height={20} className="md:w-6 md:h-6" />} label="일기 쓰기" variant="dark" />
          </motion.div>
          
          {/* 내 일기 & 나의 일상 분석 - 모바일: 나란히 wrapper, 데스크톱: 개별 */}
          <div className="flex md:contents gap-4 md:gap-6 w-full">
            <motion.div 
              className="flex-1"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <HomeButton to="/diaries" icon={<BookIcon width={20} height={20} className="md:w-6 md:h-6" />} label="내 일기" />
            </motion.div>
            <motion.div 
              className="flex-1"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <HomeButton to="/analysis" icon={<ChartIcon width={20} height={20} className="md:w-6 md:h-6" />} label="나의 일상 분석" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}


