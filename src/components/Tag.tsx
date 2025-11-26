interface TagProps {
  text: string;
  count?: number;
  variant?: 'primary' | 'secondary';
}

export default function Tag({ text, count, variant = 'primary' }: TagProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <span 
      className={`px-4 py-[5px] rounded-[8px] text-[14px] font-semibold inline-flex items-center gap-2 ${
        isPrimary 
          ? 'bg-[#eae8ff] text-[#745ede]' 
          : 'bg-[#f7f6ff] text-[#b5a9e8]'
      }`}
    >
      {text}
      {count !== undefined && (
        <span className={`text-[12px] ${isPrimary ? 'text-[#9e89ff]' : 'text-[#c9bfed]'}`}>
          {count}
        </span>
      )}
    </span>
  );
}

