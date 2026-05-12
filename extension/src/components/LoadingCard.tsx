import React, { useState, useEffect } from 'react';

export default function LoadingCard() {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSlow(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const cardStyle: React.CSSProperties = {
    width: '320px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    padding: '20px',
    border: '1px solid #f0f0f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textAlign: 'center'
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '20px', marginRight: '8px' }}>🔍</span>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Real Pick</h2>
      </div>
      <div style={{ padding: '20px 0' }}>
        {/* 로딩 애니메이션 */}
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', fontWeight: 'bold' }}>⏳ 리뷰 분석 중...</p>
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#9ca3af', lineHeight: '1.4' }}>
          리뷰 수집 → 신뢰도 판별<br />→ AI 요약 순으로 진행
        </p>
        {isSlow && (
          <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>
            분석에 시간이 걸리고 있습니다.
          </p>
        )}
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}