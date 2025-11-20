import { motion } from 'framer-motion';

interface GuidanceMessageProps {
  children: React.ReactNode;
  className?: string;
}

export default function GuidanceMessage({ children, className = '' }: GuidanceMessageProps) {
  return (
    <motion.div 
      className={`text-center ${className}`}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span 
        className="bg-clip-text text-transparent text-2xl font-bold leading-relaxed"
        style={{
          background: 'linear-gradient(90deg, #938CC8 0%, #C3C0D7 50%, #938CC8 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'gradient-flow 5s ease infinite'
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}


