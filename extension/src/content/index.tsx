import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../index.css';

async function injectRealPickUI() {
  if (document.getElementById('real-pick-extension-root')) return;

  // 1. 최상위 컨테이너 생성 및 기본 위치 고정
  const container = document.createElement('div');
  container.id = 'real-pick-extension-root';
  // 네이버 UI와 겹치지 않도록 스타일 지정
  Object.assign(container.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '2147483647', // 최상단 배치
    width: '320px',       // 너비 고정
    minHeight: '100px'
  });
  document.body.appendChild(container);

  // 2. Shadow DOM 생성
  const shadowRoot = container.attachShadow({ mode: 'open' });
  const innerRoot = document.createElement('div');
  innerRoot.id = 'real-pick-inner-root';
  shadowRoot.appendChild(innerRoot);

  // 3. 스타일 주입
  // Vite의 ?inline 쿼리를 사용하여 CSS를 문자열로 직접 가져옴
  try {
    const cssModule = await import('../index.css?inline');
    const styleTag = document.createElement('style');
    styleTag.textContent = cssModule.default;
    shadowRoot.appendChild(styleTag);
  } catch (e) {
    console.error("CSS 주입 실패:", e);
  }

  const root = createRoot(innerRoot);
  root.render(<App />);
}

// 네이버 쇼핑은 페이지 이동이 잦으므로 주소 변경 감지 로직 추가
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(injectRealPickUI, 1000); // 페이지 로딩 대기 후 주입
  }
}).observe(document, { subtree: true, childList: true });

injectRealPickUI();