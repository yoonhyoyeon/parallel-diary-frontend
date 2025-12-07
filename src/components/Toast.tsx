import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  actionText?: string;
  onActionClick?: () => void;
}

export default function Toast({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose,
  duration = 3000,
  actionText,
  onActionClick
}: ToastProps) {
  useEffect(() => {
    if (isVisible && !actionText) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration, actionText]);

  const bgColors = {
    success: 'bg-white',
    error: 'bg-white',
    info: 'bg-white',
  };

  const textColors = {
    success: 'text-[#2b2b2b]',
    error: 'text-red-500',
    info: 'text-[#2b2b2b]',
  };

  const icons = {
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#745ede]">
        <path d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    info: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#745ede]">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto"
        >
          <div className={`${bgColors[type]} px-5 py-4 rounded-2xl shadow-[0px_4px_24px_0px_rgba(0,0,0,0.12)] border border-[#e8e8e8] flex items-center gap-3 min-w-[280px] max-w-[500px]`}>
            {/* 아이콘 */}
            <div className="shrink-0">
              {icons[type]}
            </div>
            
            {/* 메시지 */}
            <p className={`text-sm md:text-base font-medium flex-1 ${textColors[type]}`}>
              {message}
            </p>
            
            {/* 액션 버튼 */}
            {actionText && onActionClick && (
              <button
                onClick={() => {
                  onActionClick();
                  onClose();
                }}
                className="shrink-0 text-[#745ede] font-bold text-sm hover:text-[#5d4bc4] transition-colors flex items-center gap-1"
              >
                {actionText}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            )}
            
            {/* 닫기 버튼 */}
            {!actionText && (
              <button
                onClick={onClose}
                className="shrink-0 text-[#9ca3af] hover:text-[#6b7280] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

