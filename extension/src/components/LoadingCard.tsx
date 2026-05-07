import React, { useState, useEffect } from 'react';

export default function LoadingCard() {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    // 10초 초과 시 지연 메시지 표시
    const timer = setTimeout(() => setIsSlow(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-80 bg-white shadow-lg rounded-xl p-5 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xl">🔍</span>
        <h2 className="text-lg font-bold">Real Pick</h2>
      </div>
      <div className="flex flex-col items-center justify-center py-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-sm text-gray-600 font-medium">⏳ 리뷰 분석 중...</p>
        <p className="text-xs text-gray-400 mt-2 text-center">
          리뷰 수집 → 신뢰도 판별<br />→ AI 요약 순으로 진행
        </p>
        {isSlow && (
          <p className="text-xs text-red-500 mt-3 font-semibold">
            분석에 시간이 걸리고 있습니다.
          </p>
        )}
      </div>
    </div>
  );
}