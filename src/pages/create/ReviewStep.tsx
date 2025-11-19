import { useState } from 'react';

interface ReviewStepProps {
  initialContent: string;
  onComplete: (editedContent: string) => void;
  onBack: () => void;
}

export default function ReviewStep({ initialContent, onComplete, onBack }: ReviewStepProps) {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = () => {
    if (content.trim()) {
      onComplete(content);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">일기 확인 및 수정</h1>
        
        {/* TODO: 일기 수정 UI 구현 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#9E89FF] focus:border-transparent"
            placeholder="일기 내용을 확인하고 수정하세요..."
          />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            이전으로
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-[#9E89FF] text-white rounded-lg hover:bg-[#8B76E6] transition-colors"
            disabled={!content.trim()}
          >
            평행일기 생성하기
          </button>
        </div>
      </div>
    </div>
  );
}

