import { motion } from 'framer-motion';

export default function MonotonyScoreCard() {
  const monotonyScore = 80; // API에서 받은 단조로움 지수
  const score = 100 - monotonyScore; // 다채로움 지수로 변환
  
  // 점수에 따른 상태 결정 (높을수록 좋음)
  const getScoreStatus = (score: number) => {
    if (score >= 70) {
      return {
        message: '다채로운 일상을 보내고 있어요!',
        messageColor: '#9E89FF',
        scoreColor: '#9E89FF',
        gradientOpacity: 0.40,
        emoji: '✨'
      };
    } else if (score >= 50) {
      return {
        message: '적당한 일상을 보내고 있어요',
        messageColor: '#BDB3FF',
        scoreColor: '#BDB3FF',
        gradientOpacity: 0.30,
        emoji: '😊'
      };
    } else if (score >= 30) {
      return {
        message: '일상에 변화가 필요해요',
        messageColor: '#D9D4FF',
        scoreColor: '#D9D4FF',
        gradientOpacity: 0.20,
        emoji: '⚠️'
      };
    } else {
      return {
        message: '일상에 큰 변화가 필요해요!',
        messageColor: '#EAE8FF',
        scoreColor: '#EAE8FF',
        gradientOpacity: 0.10,
        emoji: '🚨'
      };
    }
  };

  const status = getScoreStatus(score);

  return (
    <motion.div
      className="relative min-h-[160px] lg:h-[181px] rounded-[24px] overflow-hidden bg-[#000000]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* 오른쪽 그라데이션 원형 */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-y-1/2 w-[120px] lg:w-[150px] h-[120px] lg:h-[150px] bg-[#6445EF] blur-2xl rounded-full" 
        style={{ opacity: status.gradientOpacity }}
      />
      
      {/* 컨텐츠 */}
      <div className="relative px-6 lg:px-8 py-6 lg:py-7 flex flex-col h-full">
        <h3 className="text-xl lg:text-[24px] font-bold text-white mb-2 leading-none">
          현재 다채로움 지수
        </h3>
        <p 
          className="text-sm lg:text-[16px] mb-auto leading-none font-medium"
          style={{ color: status.messageColor }}
        >
          {status.emoji} {status.message}
        </p>
        
        {/* 점수 */}
        <div className="flex items-baseline gap-1">
          <span 
            className="text-4xl lg:text-[52px] font-medium leading-none"
            style={{ color: status.scoreColor }}
          >
            {score}
          </span>
          <span className="text-lg lg:text-[24px] font-medium text-[#acacac] leading-none">/100</span>
        </div>
      </div>
    </motion.div>
  );
}

