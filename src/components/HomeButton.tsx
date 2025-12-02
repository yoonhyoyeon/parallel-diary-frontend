import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

interface HomeButtonProps {
  to: string;
  icon: ReactNode;
  label: string;
  variant?: 'dark' | 'light';
}

export default function HomeButton({ to, icon, label, variant = 'light' }: HomeButtonProps) {
  const isDark = variant === 'dark';
  
  return (
    <Link to={to} className="flex-1 block h-full">
      <div className={`flex space-y-reverse aspect-square rounded-[20px] md:rounded-[24px] shadow-[5px_13px_29px_0px_rgba(0,0,0,0.08)] cursor-pointer hover:scale-105 active:scale-95 transition-transform h-full ${
        isDark 
          ? 'backdrop-blur-[36px] bg-black/10 text-[#ffffff] md:space-y-reverse md:aspect-square !aspect-auto md:!aspect-square !items-center md:!items-stretch !justify-between md:!justify-start !px-6 !py-5 md:!p-8' 
          : 'backdrop-blur-[182px] bg-white/65 text-[#6b86b2] p-5 md:p-8'
      }`}>
          <div className="flex items-end w-full h-full">
            <div className={`flex ${isDark ? 'flex-row-reverse w-full justify-between md:justify-start md:w-auto' : 'flex-col'}`}>
              {icon}
              <div className={`${isDark ? 'flex items-center md:mr-4' : 'mt-2 md:mt-3'} text-base md:text-[18px] lg:text-[20px] leading-tight font-semibold`}>{label}</div>
            </div>
          </div>
      </div>
    </Link>
  );
}