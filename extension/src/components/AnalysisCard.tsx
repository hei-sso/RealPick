import React, { useState } from 'react';
import ReviewSummary from './ReviewSummary';
import SuspiciousList from './SuspiciousList';

export default function AnalysisCard({ data, onClose }: { data: any, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'SUSPICIOUS'>('SUMMARY');

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 15px 45px rgba(0, 0, 0, 0.2)',
    width: '320px',
    minHeight: '400px', // 찌부 방지
    padding: '24px',
    boxSizing: 'border-box',
    border: '1px solid #efefef',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const conclusionStyle: React.CSSProperties = {
    padding: '18px',
    borderRadius: '14px',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: '16px',
    margin: '10px 0',
    backgroundColor: data.conclusion === '구매 추천' ? '#f0fdf4' : '#fff7ed',
    color: data.conclusion === '구매 추천' ? '#166534' : '#c2410c',
    border: `2px solid ${data.conclusion === '구매 추천' ? '#bbf7d0' : '#ffedd5'}`
  };

  return (
    <div style={cardStyle}>
      {/* 헤더 섹션 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#111827' }}>분석 결과</h2>
        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', color: '#9ca3af' }}>✕</button>
      </div>

      {/* 신뢰도 점수 섹션 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '700' }}>리뷰 신뢰도</span>
        <span style={{ fontSize: '28px', fontWeight: '900', color: data.trustScore >= 70 ? '#10b981' : '#ef4444' }}>
          {data.trustScore}점
        </span>
      </div>

      {/* 평점 비교 박스 */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <div style={{ flex: 1, padding: '14px', backgroundColor: '#f9fafb', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px', fontWeight: '600' }}>원본 평점</div>
          <div style={{ fontWeight: '800', fontSize: '16px' }}>⭐ {data.originalRating || '0.0'}</div>
        </div>
        <div style={{ flex: 1, padding: '14px', backgroundColor: '#f0f7ff', borderRadius: '12px', textAlign: 'center', border: '1px solid #d0e7ff' }}>
          <div style={{ fontSize: '11px', color: '#3b82f6', marginBottom: '6px', fontWeight: '600' }}>신뢰 평점</div>
          <div style={{ fontWeight: '800', fontSize: '16px', color: '#1e40af' }}>⭐ {data.adjustedRating || '0.0'}</div>
        </div>
      </div>

      {/* 구매 결론 박스 */}
      <div style={conclusionStyle}>
        {data.conclusion === '구매 추천' ? '✅ 안심하고 구매하세요!' : '⚠️ 주의! 광고성 리뷰가 많습니다'}
      </div>

      {/* 탭 메뉴 */}
      <div style={{ display: 'flex', borderBottom: '2px solid #f1f5f9', marginBottom: '16px' }}>
        <button 
          style={{ flex: 1, padding: '12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: activeTab === 'SUMMARY' ? '#2563eb' : '#94a3b8', borderBottom: activeTab === 'SUMMARY' ? '3px solid #2563eb' : 'none' }}
          onClick={() => setActiveTab('SUMMARY')}
        >AI 요약</button>
        <button 
          style={{ flex: 1, padding: '12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: activeTab === 'SUSPICIOUS' ? '#2563eb' : '#94a3b8', borderBottom: activeTab === 'SUSPICIOUS' ? '3px solid #2563eb' : 'none' }}
          onClick={() => setActiveTab('SUSPICIOUS')}
        >의심 리뷰</button>
      </div>

      {/* 콘텐츠 영역 */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        maxHeight: '220px', // 스크롤 최대 높이 설정
        paddingRight: '4px' 
      }}>
        {activeTab === 'SUMMARY' ? (
          <ReviewSummary data={data} />
        ) : (
          <SuspiciousList list={data.suspiciousReviews} totalRatio={data.adRatio} />
        )}
      </div>
    </div>
  );
}