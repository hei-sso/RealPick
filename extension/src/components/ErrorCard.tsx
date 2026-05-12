import React from 'react';

interface ErrorCardProps {
  message: string;
  onRetry: () => void;
  onClose: () => void;
}

export default function ErrorCard({ message, onRetry, onClose }: ErrorCardProps) {
  // 인라인 스타일
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
    width: '320px',
    padding: '20px',
    boxSizing: 'border-box',
    border: '1px solid #f0f0f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    borderBottom: '1px solid #f3f4f6',
    paddingBottom: '12px'
  };

  const errorBoxStyle: React.CSSProperties = {
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
    marginBottom: '20px'
  };

  const retryButtonStyle: React.CSSProperties = {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'background-color 0.2s'
  };

  return (
    <div style={cardStyle} className="real-pick-error-card">
      {/* 헤더 */}
      <div style={headerStyle}>
        <span style={{ fontSize: '20px', marginRight: '8px' }}>⚠️</span>
        <h2 style={{ 
          margin: 0, 
          fontSize: '18px', 
          fontWeight: '800', 
          color: '#111827',
          letterSpacing: '-0.025em'
        }}>
          오류 발생
        </h2>
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          style={{ 
            marginLeft: 'auto', 
            border: 'none', 
            background: 'none', 
            cursor: 'pointer', 
            color: '#9ca3af',
            fontSize: '18px',
            padding: '4px'
          }}
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="real-pick-content">
        <div style={errorBoxStyle}>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: '#b91c1c', 
            lineHeight: '1.5',
            wordBreak: 'break-word' // 긴 에러 메시지 줄바꿈
          }}>
            {message}
          </p>
        </div>
        
        <button 
          onClick={onRetry} 
          style={retryButtonStyle}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
        >
          다시 분석 시도
        </button>
      </div>
    </div>
  );
}