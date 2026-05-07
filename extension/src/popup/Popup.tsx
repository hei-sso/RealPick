import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

interface UsageData {
  count: number;
  resetMonth?: string;
}

export default function Popup() {
  const [usage, setUsage] = useState({ count: 0, remaining: 5 });

  useEffect(() => {
    chrome.storage.local.get(['usage'], (result) => {
      const data = result.usage as UsageData | undefined;

      if (data && typeof data.count === 'number') {
        const remaining = Math.max(0, 5 - data.count);
        setUsage({ count: data.count, remaining });
      }
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <span style={{ fontSize: '20px', marginRight: '8px' }}>🔍</span>
        <h2 style={{ margin: 0, fontSize: '18px', color: '#1f2937' }}>Real Pick</h2>
      </div>
      
      <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#4b5563', fontWeight: 'bold' }}>
          이번 달 남은 분석 횟수
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '900', color: '#3b82f6' }}>
          {usage.remaining} / 5회
        </p>
      </div>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
          네이버 쇼핑 상품 페이지에 접속하면<br/>자동으로 분석이 시작됩니다.
        </p>
      </div>
    </div>
  );
}

// HTML의 root 요소에 React 컴포넌트 렌더링
const container = document.getElementById('root');

if (container) {
  // 전역(window) 객체에 루트를 저장하여 HMR 시 재사용합니다.
  if (!(window as any)._reactRoot) {
    (window as any)._reactRoot = createRoot(container);
  }
  
  (window as any)._reactRoot.render(<Popup />);
}