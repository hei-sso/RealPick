// 백엔드 API 주소 (배포 후에는 Railway 서버 URL로 변경해야 합니다)
const API_BASE_URL = 'http://localhost:3000'; 

// Content Script에서 보내는 메시지 수신
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYZE') {
    handleAnalyzeRequest(message.data)
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ 
        success: false, 
        error: { message: error.message } 
      }));
    
    // 비동기 응답(sendResponse를 나중에 호출)을 위해 반드시 true를 반환해야 합니다.
    return true; 
  }
});

async function handleAnalyzeRequest(data: { url: string, reviews: any[] }) {
  // 1. 분석 횟수 제한 체크 (월 5회)
  const canAnalyze = await checkAndIncrementUsage();
  if (!canAnalyze) {
    throw new Error('이번 달 무료 분석 횟수(5회)를 모두 사용했습니다');
  }

  // 2. 백엔드 API 호출
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: data.url,
        // productName은 실제로는 scraper에서 파싱해서 넘겨주는 것이 좋습니다.
        productName: '네이버 쇼핑 상품',
        reviews: data.reviews,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요');
  }
}

// Extension Storage 기반 월별 횟수 관리 로직
async function checkAndIncrementUsage(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['usage'], (result: any) => {
      const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM' 형식
      const usage = result.usage || { count: 0, resetMonth: currentMonth };

      // 달이 바뀌었으면 초기화
      if (usage.resetMonth !== currentMonth) {
        usage.count = 0;
        usage.resetMonth = currentMonth;
      }

      // 5회 이상 사용했으면 차단
      if (usage.count >= 5) {
        resolve(false);
        return;
      }

      // 횟수 증가 후 스토리지에 저장
      usage.count += 1;
      chrome.storage.local.set({ usage }, () => {
        resolve(true);
      });
    });
  });
}