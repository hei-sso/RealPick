export interface ReviewData {
  content: string;
  rating: number;
  writtenAt: string;
}

// 광고성 키워드 목록
const AD_KEYWORDS = ['협찬', '제공받아', '체험단', '무상제공', '광고']; 
const REPEAT_THRESHOLD = 3; // 동일 단어 3회 이상 반복 시 감점

export function calcTrustScore(review: ReviewData): { score: number; reason: string | null } {
  let score = 100;
  let reason = null;

  // 1. 광고성 키워드 탐지 (-40점)
  if (AD_KEYWORDS.some(kw => review.content.includes(kw))) {
    score -= 40;
    reason = '광고성 키워드 포함';
  }

  // 2. 반복 표현 탐지 (-20점)
  const words = review.content.split(' ');
  const wordCount = words.reduce((acc, w) => {
    acc[w] = (acc[w] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (Object.values(wordCount).some(c => c >= REPEAT_THRESHOLD)) {
    score -= 20;
    if (!reason) reason = '반복 표현 감지';
  }

  // 3. 과도한 긍정 어뷰징 탐지 (-20점)
  if (review.content.length < 10 && review.rating === 5) {
    score -= 20;
    if (!reason) reason = '비정상적 짧은 긍정 리뷰';
  }

  return { 
    score: Math.max(0, score),
    reason 
  };
}

export function calcAdjustedRating(reviews: (ReviewData & { trustScore: number })[]): number {
  // 신뢰 리뷰(점수 50점 이상)만 필터링하여 재계산
  const trustedReviews = reviews.filter(r => r.trustScore >= 50); 
  if (trustedReviews.length === 0) return 0;
  
  const sum = trustedReviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / trustedReviews.length) * 10) / 10; // 소수점 1자리 반환
}