interface ScenarioCardProps {
  emoji: string;
  title: string;
  description: string;
  score: number;
}

export default function ScenarioCard({ emoji, title, description, score }: ScenarioCardProps) {
  const titleColor = score >= 50 ? '#68a1f2' : '#9e89ff';
  
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

