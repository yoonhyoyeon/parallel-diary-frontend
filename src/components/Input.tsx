import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'auth' | 'default';
}

export default function Input({ variant = 'default', className = '', ...props }: InputProps) {
  const variantStyles = {
    auth: "w-full px-7 py-4 bg-[rgba(213,213,213,0.1)] backdrop-blur-[200px] border rounded-[14px] text-white text-[18px] placeholder:text-[#949494] outline-none transition-colors",
    default: "w-full px-4 py-3 border rounded-lg outline-none"
  };

  const focusStyles = {
    auth: "focus:border-[#b8a7ff]",
    default: "focus:border-blue-500"
  };

  return (
    <input
      className={`${variantStyles[variant]} ${focusStyles[variant]} ${className}`}
      style={{ letterSpacing: '-0.4px' }}
      {...props}
    />
  );
}

