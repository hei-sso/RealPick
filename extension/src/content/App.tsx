import React, { useState } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import LoadingCard from '../components/LoadingCard';
import AnalysisCard from '../components/AnalysisCard';
import ErrorCard from '../components/ErrorCard';

export default function App() {
  const { status, result, errorMsg, retry } = useAnalysis();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const wrapperStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 2147483647, // 최상단 배치
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  };

  return (
    <div className="real-pick-position-wrapper" style={wrapperStyle}>
      {/* 1. 로딩 중일 때 */}
      {status === 'LOADING' && <LoadingCard />}
      
      {/* 2. 완료되었을 때 */}
      {status === 'COMPLETE' && result && (
        <AnalysisCard 
          data={result} 
          onClose={() => setIsVisible(false)} 
        />
      )}

      {/* 3. 에러 발생 시 */}
      {status === 'ERROR_STATE' && errorMsg && (
        <ErrorCard 
          message={errorMsg} 
          onRetry={retry}
          onClose={() => setIsVisible(false)}
        />
      )}
    </div>
  );
}