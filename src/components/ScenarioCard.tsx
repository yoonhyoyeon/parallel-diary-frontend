import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import PlusIcon from '@/assets/icons/plus.svg?react';

interface ScenarioCardProps {
  id: string;
  emoji: string;
  title: string;
  description: string;
  onAddToBucketList?: (id: string) => void;
  isInBucketList?: boolean;
  variant?: 'default' | 'white';
  onDelete?: (id: string) => void;
  enableDetailLink?: boolean;
}

// ID를 기반으로 1~20 사이의 고정된 랜덤 값 생성
function generateScoreFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit 정수로 변환
  }
  // 절댓값을 1~20 범위로 변환
  return (Math.abs(hash) % 20) + 1;
}

export default function ScenarioCard({ 
  id, 
  emoji, 
  title, 
  description,
  onAddToBucketList,
  isInBucketList = false,
  variant = 'default',
  onDelete,
  enableDetailLink = false,
}: ScenarioCardProps) {
  const navigate = useNavigate();
  const score = generateScoreFromId(id);
  const titleColor = score >= 10 ? '#68a1f2' : '#9e89ff';
  
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToBucketList && !isInBucketList) {
      onAddToBucketList(id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleCardClick = () => {
    if (enableDetailLink) {
      navigate({ to: '/activity/$id', params: { id } });
    }
  };
  
  const isWhiteVariant = variant === 'white';
  const bgColor = isWhiteVariant ? 'bg-white' : 'bg-[#090615]';
  const textColor = isWhiteVariant ? 'text-[#181818]' : 'text-[#d9d4ff]';
  const scoreColor = isWhiteVariant ? 'text-[#878787]' : 'text-[#929292]';
  const buttonHoverBg = isWhiteVariant ? 'hover:bg-gray-100' : 'hover:bg-white/10';
  const buttonTextColor = isWhiteVariant ? 'text-[#595959] hover:text-[#181818]' : 'text-[#d9d4ff] hover:text-white';
  
  const cardClasses = `flex-1 ${bgColor} rounded-[24px] p-5 lg:p-6 flex flex-col gap-3 lg:gap-4 h-full min-h-0 relative group ${isWhiteVariant ? 'shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)]' : ''} ${enableDetailLink ? 'cursor-pointer' : ''}`;
  
  return (
    <div className={cardClasses} onClick={handleCardClick}>
      <h3
        className="text-lg lg:text-[20px] font-bold shrink-0 flex items-center gap-2"
        style={{ color: titleColor }}
      >
        <span>{emoji}</span>
        <span className={enableDetailLink ? 'group-hover:underline underline-offset-4 transition-all duration-200' : ''}>
          {title}
        </span>
      </h3>
      <p className={`text-sm lg:text-[16px] ${textColor} leading-[1.5] flex-1 min-h-0 line-clamp-4`}>
        {description}
      </p>
      <div className="flex items-center justify-between shrink-0">
        <p className={`text-xs lg:text-[14px] ${scoreColor}`}>+ {score}</p>
        {onAddToBucketList && !isInBucketList && (
          <button
            onClick={handleAddClick}
            className={`flex items-center gap-1.5 text-xs lg:text-[14px] ${buttonTextColor} transition-colors px-3 py-1.5 rounded-lg ${buttonHoverBg}`}
          >
            <PlusIcon width={12} height={12} />
            버킷리스트에 추가
          </button>
        )}
        {isInBucketList && !onDelete && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className="flex items-center gap-1.5 text-xs lg:text-[14px] text-[#745ede] px-3 py-1.5 relative"
          >
            {/* 반짝임 효과 배경 */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.5, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              className="absolute inset-0 bg-[#745ede] rounded-lg"
            />
            
            {/* 체크 아이콘 */}
            <motion.svg
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.2,
                ease: "easeInOut"
              }}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10"
            >
              <motion.path 
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2,
                  ease: "easeInOut"
                }}
              />
            </motion.svg>
            
            {/* 텍스트 */}
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.3,
              }}
              className="relative z-10"
            >
              추가됨
            </motion.span>
            
            {/* 반짝이는 파티클들 */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, (i - 1) * 15],
                  y: [0, -15 - i * 5],
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute w-1 h-1 bg-[#745ede] rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
              />
            ))}
          </motion.div>
        )}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className={`flex items-center gap-1.5 text-xs lg:text-[14px] text-red-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg ${isWhiteVariant ? 'hover:bg-red-50' : 'hover:bg-red-500/10'}`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
            </svg>
            삭제
          </button>
        )}
      </div>
    </div>
  );
}

