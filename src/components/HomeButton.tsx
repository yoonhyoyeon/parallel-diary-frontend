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
    <Link to={to} className="flex-1 ">
      <div className={`flex space-y-reverse aspect-square p-8 rounded-[24px] shadow-[5px_13px_29px_0px_rgba(0,0,0,0.08)] cursor-pointer hover:scale-105 transition-transform ${
        isDark 
          ? 'backdrop-blur-[36px] bg-black/10 text-[#ffffff]' 
          : 'backdrop-blur-[182px] bg-white/65 text-[#6b86b2]'
      }`}>
          <div className="flex items-end">
            <div className={`flex ${isDark ? 'flex-row-reverse' : 'flex-col'}`}>
              {icon}
              <div className={`${isDark ? 'flex items-center mr-4' : 'mt-3'} text-[20px] leading-[16.555px] font-semibold`}>{label}</div>
            </div>
            
          </div>
      </div>
    </Link>
  );
}