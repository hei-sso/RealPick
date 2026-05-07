import React from 'react';

interface SuspiciousReview {
  content: string;
  reason: string;
  trustScore: number;
}

interface SuspiciousListProps {
  list: SuspiciousReview[];
  totalRatio: number; // 0 ~ 1 사이의 비율
}

export default function SuspiciousList({ list, totalRatio }: SuspiciousListProps) {
  if (!list || list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <span className="text-3xl mb-2">✨</span>
        <p className="text-sm font-semibold text-gray-700">의심되는 리뷰가 없습니다!</p>
        <p className="text-xs text-gray-500 mt-1">대부분의 리뷰가 신뢰할 만합니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pr-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-gray-700">
          ⚠️ 의심 리뷰 {list.length}개 ({Math.round(totalRatio * 100)}%)
        </span>
      </div>

      <div className="space-y-3">
        {list.map((review, idx) => (
          <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            {/* 탐지 근거 태그 */}
            <div className="mb-2">
              <span className="inline-block bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded font-bold">
                {review.reason.includes('광고') ? '🔴' : '🟡'} {review.reason}[cite: 5]
              </span>
            </div>
            
            {/* 리뷰 본문 (너무 길면 자름) */}
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
              "{review.content}"
            </p>
            
            {/* 개별 신뢰도 점수 (선택적 표시) */}
            <div className="mt-2 text-right">
              <span className="text-[10px] text-gray-400 font-medium">
                신뢰도: {review.trustScore}점
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}