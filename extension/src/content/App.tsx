import React, { useState } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import LoadingCard from '../components/LoadingCard';
import AnalysisCard from '../components/AnalysisCard';
import ErrorCard from '../components/ErrorCard';

export default function App() {
  const { status, result, errorMsg, retry } = useAnalysis();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="real-pick-container">
      {status === 'LOADING' && <LoadingCard />}
      
      {status === 'COMPLETE' && result && (
        <AnalysisCard data={result} onClose={() => setIsVisible(false)} />
      )}

      {status === 'ERROR_STATE' && errorMsg && (
        <ErrorCard message={errorMsg} onRetry={retry} />
      )}
    </div>
  );
}