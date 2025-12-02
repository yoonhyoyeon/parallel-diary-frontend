import { Link } from '@tanstack/react-router';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ 
  to = '/', 
  label = '뒤로가기',
  className = '' 
}: BackButtonProps) {
  return (
    <Link to={to} className={`flex items-center gap-2 ${className}`}>
      <ArrowLeftIcon width={18} height={18} />
      <span className="font-semibold text-[#090615] hidden md:inline">{label}</span>
    </Link>
  );
}

