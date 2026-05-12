import { useState, useEffect } from 'react';
import { scrapeReviews, validateReviews, getProductRating } from '../content/scraper'; 

type AnalysisState = 'IDLE' | 'LOADING' | 'COMPLETE' | 'ERROR_STATE';

export function useAnalysis() {
  const [status, setStatus] = useState<AnalysisState>('IDLE');
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    startAnalysis();
  }, []);

  const startAnalysis = async () => {
    setStatus('LOADING');
    
    try {
      // 1. 리뷰 데이터 수집 (최대 100개)
      const reviews = scrapeReviews();
      const originalRating = getProductRating(); 
      
      if (!validateReviews(reviews)) {
        throw new Error('NO_REVIEWS');
      }

      // 2. Background Worker로 메시지 전송 (백엔드 API 호출 위임)
      chrome.runtime.sendMessage(
        { type: 'ANALYZE', data: { url: window.location.href, reviews, originalRating } },
        (response: any) => {
          if (response && response.success) {
            setResult(response.data);
            setStatus('COMPLETE');
          } else {
            setErrorMsg(response?.error?.message || '분석 중 오류가 발생했습니다.');
            setStatus('ERROR_STATE');
          }
        }
      );
    } catch (error: any) {
      if (error.message === 'NO_REVIEWS') {
        setErrorMsg('리뷰가 없어 분석할 수 없습니다');
      } else {
        setErrorMsg('현재 이 페이지에서 리뷰를 가져올 수 없습니다');
      }
      setStatus('ERROR_STATE');
    }
  };

  return { status, result, errorMsg, retry: startAnalysis };
}