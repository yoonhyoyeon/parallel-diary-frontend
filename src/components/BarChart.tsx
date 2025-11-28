interface BarChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
}

export default function BarChart({ data }: BarChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex w-full h-[180px] lg:h-[201px]">
      {data.map((item, index) => {
        const percentage = ((item.value / total) * 100).toFixed(0);
        const widthPercent = (item.value / total) * 100;
        
        return (
          <div
            key={index}
            className="rounded-[19.745px] flex flex-col tems-left justify-between py-5 px-5"
            style={{ 
              backgroundColor: item.color,
              width: `${widthPercent}%`,
            }}
          >
            <p className="text-base lg:text-[20px] font-medium text-white text-left leading-tight whitespace-pre-line">
              {item.label}
            </p>
            <div className="text-white text-left">
              <span className="text-xl lg:text-[24.681px] font-semibold">{percentage}</span>
              <span className="text-sm lg:text-[14.809px] text-white/80">%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

