import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // AnalysisCard, LoadingCard 등을 관리하는 최상위 컨테이너
import '../index.css';

function injectRealPickUI() {
  // 네이버 쇼핑 상품 페이지인지 한 번 더 확인 (Manifest에서 걸렀지만 방어 코드)
  if (!window.location.href.includes('shopping.naver.com/products')) return;

  // 컨테이너 생성 및 스타일 지정 (우측 고정 오버레이)
  const container = document.createElement('div');
  container.id = 'real-pick-extension-root';
  container.style.position = 'fixed';
  container.style.top = '20px';
  container.style.right = '20px';
  container.style.zIndex = '999999'; // 네이버 쇼핑 헤더보다 높게 설정
  
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<App />);
}

// 스크립트 로드 시 즉시 주입
injectRealPickUI();