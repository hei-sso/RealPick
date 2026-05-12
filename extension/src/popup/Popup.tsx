import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

interface UsageData { count: number; }

export default function Popup() {
  const [usage, setUsage] = useState({ count: 0, remaining: 5 });

  useEffect(() => {
    chrome.storage.local.get(['usage'], (result) => {
      const data = result.usage as UsageData | undefined;
      if (data && typeof data.count === 'number') {
        setUsage({ count: data.count, remaining: Math.max(0, 5 - data.count) });
      }
    });
  }, []);

  // 인라인 스타일
  const popupStyle: React.CSSProperties = {
    width: '320px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #f3f4f6',
    paddingBottom: '12px'
  };

  const usageBoxStyle: React.CSSProperties = {
    backgroundColor: '#f3f9ff',
    border: '1px solid #e0f2fe',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '20px'
  };

  return (
    <div style={popupStyle}>
      {/* 헤더 */}
      <div style={headerStyle}>
        <span style={{ fontSize: '20px', marginRight: '8px' }}>🔍</span>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#111827' }}>
          Real Pick
        </h2>
      </div>
      
      {/* 콘텐츠 영역 */}
      <div style={usageBoxStyle}>
        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: 'bold' }}>
          이번 달 남은 분석 횟수
        </p>
        <p style={{ margin: '12px 0 0 0', fontSize: '28px', fontWeight: '900', color: '#3b82f6' }}>
          {usage.remaining} <span style={{ fontSize: '16px', color: '#9ca3af', fontWeight: 'normal' }}>/ 5회</span>
        </p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', lineHeight: '1.6' }}>
          네이버 쇼핑 상품 페이지에 접속하면<br/>
          <span style={{ color: '#3b82f6', fontWeight: '600' }}>자동으로 분석</span>이 시작됩니다.
        </p>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
if (container && !(window as any)._reactRoot) {
  (window as any)._reactRoot = createRoot(container);
  (window as any)._reactRoot.render(<Popup />);
}