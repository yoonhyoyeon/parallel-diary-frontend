import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 md:w-10 md:h-10 border-3',
    lg: 'w-12 h-12 md:w-16 md:h-16 border-4',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full border-[#e5e5e5] border-t-[#745ede] ${className}`}
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

