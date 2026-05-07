import React from 'react';

interface ErrorCardProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="w-80 bg-white shadow-2xl rounded-xl p-6 border border-red-100 flex flex-col items-center">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xl">🔍</span>
        <h2 className="text-lg font-bold text-gray-800">Real Pick</h2>
      </div>
      
      <div className="text-4xl mb-4">⚠️</div>
      
      <p className="text-sm text-center text-gray-700 font-medium mb-6 leading-relaxed">
        {message} {/* 상황별 메시지 출력 */}
      </p>

      <button 
        onClick={onRetry}
        className="w-full bg-gray-800 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-gray-700 transition-colors"
      >
        다시 시도 {/* 재시도 버튼 */}
      </button>
    </div>
  );
}