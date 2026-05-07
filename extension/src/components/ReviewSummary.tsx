import React from 'react';

interface ReviewSummaryProps {
  data: {
    positiveSummary?: string;
    negativeSummary?: string;
    pros?: string[];
    cons?: string[];
    aiUnavailable?: boolean;
  };
}

export default function ReviewSummary({ data }: ReviewSummaryProps) {
  // GPT API 호출 실패 시 Rule 기반 결과만 있고 요약이 없을 때의 처리
  if (data.aiUnavailable) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <span className="text-3xl mb-2">🤖🔌</span>
        <p className="text-sm font-semibold text-gray-700">AI 요약을 일시적으로 제공할 수 없습니다.</p>
        <p className="text-xs text-gray-500 mt-1">리뷰 신뢰도 점수 및 비율은 정상적으로 제공됩니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pr-1">
      {/* 긍정 & 부정 요약 */}
      <div className="space-y-2">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-1 mb-1">
            <span>👍</span>
            <span className="text-xs font-bold text-blue-800">긍정 요약</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            {data.positiveSummary || '긍정적인 리뷰 내용이 부족합니다.'}
          </p>
        </div>

        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
          <div className="flex items-center space-x-1 mb-1">
            <span>👎</span>
            <span className="text-xs font-bold text-red-800">부정 요약</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            {data.negativeSummary || '부정적인 리뷰 내용이 부족합니다.'}
          </p>
        </div>
      </div>

      {/* 장단점 키워드 */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
        <div>
          <span className="text-xs font-bold text-gray-600 block mb-2">✅ 자주 언급된 장점</span>
          <div className="flex flex-wrap gap-1">
            {data.pros && data.pros.length > 0 ? (
              data.pros.map((pro, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-medium">
                  {pro}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">데이터 없음</span>
            )}
          </div>
        </div>
        <div>
          <span className="text-xs font-bold text-gray-600 block mb-2">❌ 자주 언급된 단점</span>
          <div className="flex flex-wrap gap-1">
            {data.cons && data.cons.length > 0 ? (
              data.cons.map((con, idx) => (
                <span key={idx} className="bg-red-100 text-red-700 text-[10px] px-2 py-1 rounded-full font-medium">
                  {con}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">데이터 없음</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}