import { motion } from 'framer-motion';

interface ChatMessageProps {
  author: 'ai' | 'user';
  content: string;
}

export default function ChatMessage({ author, content }: ChatMessageProps) {
  const isAI = author === 'ai';

  return (
    <motion.div 
      className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div
        className={`max-w-[70%] px-6 py-4 rounded-2xl backdrop-blur-[250px] ${
          isAI
            ? 'bg-white shadow-[0px_0px_30px_0px_rgba(0,0,0,0.06)]'
            : 'bg-[#090615] text-white shadow-[4px_0px_14px_0px_rgba(0,0,0,0.04)]'
        }`}
      >
        <p className={`text-lg leading-relaxed whitespace-pre-wrap ${isAI ? 'font-medium' : 'font-normal'}`}>
          {content}
        </p>
      </div>
    </motion.div>
  );
}