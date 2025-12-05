import exploreIcon from '@/assets/icons/explore_icon.png';
import clockIcon from '@/assets/icons/clock_icon.png';
import hammerIcon from '@/assets/icons/hammer.png';

export type DailyTypeValue = 'explore' | 'routine' | 'action';

interface DailyTypeDisplayProps {
  type: DailyTypeValue;
}

// 타입별 고정 데이터
const typeData: Record<DailyTypeValue, { icon: string; emoji: string; title: string; description: string }> = {
  explore: {
    icon: exploreIcon,
    emoji: '🤩',
    title: '새로운 시도형',
    description: '익숙한 틀보다 새로운 방식이나 아이디어를 탐색하는 걸 즐기는 유형이에요. 실험적인 시도를 통해 동기를 얻는 편이에요.',
  },
  routine: {
    icon: clockIcon,
    emoji: '📋',
    title: '루틴 충실형',
    description: '일상적인 루틴을 안정적으로 유지하는 데 강점이 있는 유형이에요. 새로운 변화보다 익숙한 방식에서 더 좋은 성과를 내요.',
  },
  action: {
    icon: hammerIcon,
    emoji: '💪',
    title: '계획 실천형',
    description: '무엇을 시작하기 전에 명확한 계획을 세우고 단계적으로 실행하는 유형이에요. 목표를 구조화해 움직이는 걸 선호해요.',
  },
};

export default function DailyTypeDisplay({ type }: DailyTypeDisplayProps) {
  const data = typeData[type];

  return (
    <div className="relative bg-linear-to-br from-[#b39fff] via-[#a591ff] to-[#9681ff] rounded-[20px] lg:rounded-[24px] overflow-hidden">
      {/* 내부 그림자 효과 */}
      <div className="absolute inset-0 pointer-events-none shadow-[0px_3px_50.6px_0px_inset_#6343ff]" />
      
      <div className="relative px-6 py-8 lg:px-8 lg:py-10 flex flex-col items-center gap-4 lg:gap-6">
        {/* 아이콘 */}
        <div className="flex items-center justify-center w-[120px] h-[80px] lg:w-[140px] lg:h-[90px]">
          <img 
            src={data.icon} 
            alt={data.title}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* 타입명 */}
        <h3 className="text-lg lg:text-[20px] font-bold text-[#ffffff] text-center leading-none">
          {data.emoji}{data.title}
        </h3>
        
        {/* 설명 */}
        <p className="text-sm lg:text-[14px] text-[#ffffff] text-center leading-normal font-medium max-w-[280px] break-keep">
          {data.description}
        </p>
      </div>
    </div>
  );
}

