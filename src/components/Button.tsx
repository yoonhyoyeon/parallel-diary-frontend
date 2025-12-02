import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'auth' | 'google' | 'kakao';
  disabled?: boolean;
  icon?: { component: ReactNode; position?: 'left' | 'right' };
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  icon,
  className = '',
  type = 'button',
  loading = false,
}: ButtonProps) {
  const baseStyles =
    'flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'px-6 md:px-8 py-3 md:py-4 rounded-[46px] bg-linear-to-r from-[#855EDE] to-[#5289EE] text-white text-base md:text-[18px] font-semibold shadow-[0px_0px_30px_0px_rgba(0,0,0,0.06)]',
    secondary:
      'px-6 md:px-8 py-3 md:py-4 rounded-[46px] bg-white text-gray-700 hover:bg-gray-50 text-base md:text-[18px] font-semibold shadow-[0px_0px_30px_0px_rgba(0,0,0,0.06)]',
    auth:
      'w-full py-3 md:py-4 rounded-[14px] bg-[#fefeff] text-black text-base md:text-[18px] font-medium shadow-[5px_13px_29px_0px_rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.8)] backdrop-blur-[200px] transition-all duration-200  hover:bg-[rgba(255,255,255,1)]',
    google: 'flex-1 h-[54px] md:h-[60px] rounded-[14px] bg-white border border-[#acacac] text-black text-base md:text-[18px] font-normal',
    kakao: 'flex-1 h-[54px] md:h-[60px] rounded-[14px] bg-[#fddc3f] border border-[#acacac] text-black text-base md:text-[18px] font-normal',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${className} ${baseStyles} ${variantStyles[variant]}`}
    >
      {icon && icon.position === 'left' && icon.component}
      <span>{loading ? '처리중...' : children}</span>
      {icon && icon.position === 'right' && icon.component}
    </button>
  );
}
