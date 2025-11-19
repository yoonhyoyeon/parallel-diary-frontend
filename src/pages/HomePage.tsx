import { motion } from 'framer-motion';
import logo from '@/assets/images/home_logo_desktop.png';
import cristal_ball from '@/assets/icons/crystal_ball.png';
import HomeButton from '@/components/HomeButton';
import PlusIcon from '@/assets/icons/plus.svg?react';
import BookIcon from '@/assets/icons/book.svg?react';
import ChartIcon from '@/assets/icons/chart.svg?react';
import ParticleBackground from '@/components/ParticleBackground';
import GradientBackground from '@/components/GradientBackground';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5 bg-white relative overflow-hidden">
      <ParticleBackground />
      <GradientBackground />
      <div className="w-[700px] text-center max-w-7xl flex flex-col items-center relative z-10">
        <motion.img 
          className="w-[600px]" 
          src={logo} 
          alt="Parallel Diary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        
        <motion.div 
          className="bg-white rounded-3xl px-8 py-6 shadow-[2px_5px_30px_rgba(0,0,0,0.08)] -rotate-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="flex gap-2 mb-3">
            <img src={cristal_ball} alt="Cristal Ball" />
            <span className="text-[#C2C2C2]">오늘 하루는 어땟나요?</span>
          </div>
          <div className="text-left text-soft-black font-semibold text-[18px] pl-2">
            당신의 선택을 기록하고,<br/>만약 달랐다면 어땠을지 상상해봐요.
          </div>
        </motion.div>

        {/* 메뉴 버튼들 */}
        <motion.div 
          className="flex gap-6 mt-16 w-full"
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
            <HomeButton to="/create" icon={<PlusIcon width={24} height={24} />} label="일기 쓰기" variant="dark" />
          </motion.div>
          <motion.div 
            className="flex-1"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <HomeButton to="/diaries" icon={<BookIcon width={24} height={24} />} label="내 일기" />
          </motion.div>
          <motion.div 
            className="flex-1"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <HomeButton to="/analysis" icon={<ChartIcon width={24} height={24} />} label="나의 일상 분석" />
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}


