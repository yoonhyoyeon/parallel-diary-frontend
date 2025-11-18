import { motion } from 'framer-motion';
import logo from '@/assets/images/home_logo_desktop.png';
import cristal_ball from '@/assets/icons/crystal_ball.png';
import HomeButton from '@/components/HomeButton';
import PlusIcon from '@/assets/icons/plus.svg?react';
import BookIcon from '@/assets/icons/book.svg?react';
import ChartIcon from '@/assets/icons/chart.svg?react';
import AnimationBackground from '@/components/AnimationBackground';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5 bg-white relative overflow-hidden">
      <AnimationBackground />
      {/* 떠다니는 원형 그라데이션 배경 요소들 */}
      <div 
        className="absolute top-[5%] left-[10%] w-[700px] h-[700px] rounded-full opacity-[0.45] blur-[100px] pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #9E89FF 0%, transparent 70%)',
          animation: 'float1 20s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute top-[50%] right-[5%] w-[800px] h-[800px] rounded-full opacity-[0.45] blur-[100px] pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #68A1F2 0%, transparent 70%)',
          animation: 'float2 25s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute bottom-[10%] left-[15%] w-[650px] h-[650px] rounded-full opacity-[0.45] blur-[100px] pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #9E89FF 0%, transparent 70%)',
          animation: 'float3 22s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute top-[25%] right-[20%] w-[750px] h-[750px] rounded-full opacity-[0.45] blur-[100px] pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #68A1F2 0%, transparent 70%)',
          animation: 'float4 28s ease-in-out infinite'
        }}
      />
      
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


