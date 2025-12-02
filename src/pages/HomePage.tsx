import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import logo from '@/assets/images/home_logo_desktop.png';
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

  const handleLogout = () => {
    logout();
    navigate({ to: '/auth/login' });
  };

  return (
    <main className="min-h-screen flex flex-col md:items-center md:justify-center px-4 md:px-6 lg:px-5 bg-white relative overflow-hidden pt-24 md:pt-0 pb-[280px] md:pb-0">
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

      <div className="w-full md:w-[700px] text-center max-w-7xl flex flex-col items-center relative z-10">
        <motion.img 
          className="w-full max-w-[350px] sm:max-w-[450px] md:max-w-[550px] lg:max-w-[600px] px-4 md:px-0 mb-8 md:mb-10" 
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

        {/* 메뉴 버튼들 - 데스크톱 */}
        <motion.div 
          className="hidden md:flex md:flex-row gap-4 md:gap-6 w-full"
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
          <motion.div 
            className="flex-1"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <HomeButton to="/create" icon={<PlusIcon width={20} height={20} className="md:w-6 md:h-6" />} label="일기 쓰기" variant="dark" />
          </motion.div>
          
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
        </motion.div>
      </div>
      
      {/* 메뉴 버튼들 - 모바일 (하단 고정) */}
      <motion.div 
        className="md:hidden fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4 z-50"
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
        <div className="flex flex-col gap-3 w-full max-w-[700px] mx-auto">
          <motion.div 
            className="w-full"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <HomeButton to="/create" icon={<PlusIcon width={20} height={20} />} label="일기 쓰기" variant="dark" />
          </motion.div>
          
          <motion.div 
            className="flex gap-3 w-full"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <div className="flex-1">
              <HomeButton to="/diaries" icon={<BookIcon width={20} height={20} />} label="내 일기" />
            </div>
            <div className="flex-1">
              <HomeButton to="/analysis" icon={<ChartIcon width={20} height={20} />} label="나의 일상 분석" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}


