import React, { useState } from 'react';
import ReviewSummary from './ReviewSummary';
import SuspiciousList from './SuspiciousList';

export default function AnalysisCard({ data, onClose }: { data: any, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'SUSPICIOUS'>('SUMMARY');

  // 신뢰도 점수에 따른 색상 결정 (70 이상 초록 / 40~69 노랑 / 39 이하 빨강)
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-96 bg-white shadow-2xl rounded-xl p-5 border border-gray-200 flex flex-col">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🔍</span>
          <h2 className="text-lg font-bold">Real Pick 분석 결과</h2>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">✕</button>
      </div>

      {/* 핵심 요약 정보 */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">리뷰 신뢰도</span>
          <span className={`text-xl font-bold ${getScoreColor(data.trustScore)}`}>
            {data.trustScore}점
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">의심 리뷰 비율</span>
          <span className="text-md font-semibold text-red-500">
            {Math.round(data.adRatio * 100)}%
          </span>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">원본 평점</span>
            <span className="text-sm">⭐ {data.originalRating}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs text-blue-500 font-bold">신뢰 기반 평점</span>
            <span className="text-sm font-bold">⭐ {data.adjustedRating}</span>
          </div>
        </div>
        <div className="mt-2 p-3 bg-blue-50 rounded-lg text-center">
          <span className="text-xs text-gray-500 block mb-1">💬 이 제품 사도 될까?</span>
          <span className="text-md font-bold text-blue-700">
            {data.conclusion === '구매 추천' ? '✅ 구매 추천' : '⚠️ 고민 필요'}
          </span>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b mb-3">
        <button 
          className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'SUMMARY' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('SUMMARY')}
        >
          AI 요약
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'SUSPICIOUS' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('SUSPICIOUS')}
        >
          의심 리뷰
        </button>
      </div>

      {/* 탭 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto max-h-56 text-sm text-gray-700">
        {activeTab === 'SUMMARY' ? (
          <ReviewSummary data={data} />
        ) : (
          <SuspiciousList list={data.suspiciousReviews} totalRatio={data.adRatio} />
        )}
      </div>
    </div>
  );
}