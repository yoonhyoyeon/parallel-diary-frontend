interface ScenarioCardProps {
  id: string;
  emoji: string;
  title: string;
  description: string;
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

export default function ScenarioCard({ id, emoji, title, description }: ScenarioCardProps) {
  const score = generateScoreFromId(id);
  const titleColor = score >= 10 ? '#68a1f2' : '#9e89ff';
  
  return (
    <div className="flex-1 bg-[#090615] rounded-[24px] p-5 lg:p-6 flex flex-col gap-3 lg:gap-4">
      <h3
        className="text-lg lg:text-[20px] font-bold"
        style={{ color: titleColor }}
      >
        {emoji} {title}
      </h3>
      <p className="text-sm lg:text-[16px] text-[#d9d4ff] leading-[1.4] flex-1">
        {description}
      </p>
      <p className="text-xs lg:text-[14px] text-[#929292]">+ {score}</p>
    </div>
  );
}

