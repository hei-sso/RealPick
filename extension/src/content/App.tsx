import React, { useState } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import LoadingCard from '../components/LoadingCard';
import AnalysisCard from '../components/AnalysisCard';
// import ErrorCard from '../components/ErrorCard'; // (추후 구현)

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

      {status === 'ERROR_STATE' && (
        <div className="w-80 bg-white shadow-lg rounded-xl p-5 border border-red-200">
          <p className="text-red-600 font-bold mb-2">⚠️ 오류 발생</p>
          <p className="text-sm text-gray-700 mb-4">{errorMsg}</p>
          <button 
            onClick={retry}
            className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      )}
    </div>
  );
}