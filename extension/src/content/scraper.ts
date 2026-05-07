export interface Review {
  content: string;
  rating: number;
  writtenAt: string;
}

export function scrapeReviews(): Review[] {
  // 네이버 쇼핑 리뷰 리스트가 담긴 실제 컨테이너 셀렉터
  const reviewItems = document.querySelectorAll('li[class*="reviewItems_review_item"]');
  
  if (reviewItems.length === 0) {
    // 상품 상세 정보 하단의 리뷰 탭 영역 셀렉터 재시도
    const altReviewItems = document.querySelectorAll('._2Wp_f'); 
    return parseElements(Array.from(altReviewItems));
  }

  return parseElements(Array.from(reviewItems));
}

function parseElements(elements: Element[]): Review[] {
  // 최대 100개까지만 수집
  return elements.slice(0, 100).map(el => {
    const content = el.querySelector('[class*="reviewItems_text"]')?.textContent?.trim() || "";
    // 별점 예시: "5" 또는 "평점5" -> 숫자만 추출
    const ratingText = el.querySelector('[class*="reviewItems_average"]')?.textContent || "0";
    const rating = parseInt(ratingText.replace(/[^0-9]/g, "")) || 0;
    const writtenAt = el.querySelector('[class*="reviewItems_date"]')?.textContent?.trim() || "";

    return { content, rating, writtenAt };
  });
}

export function validateReviews(reviews: Review[]): boolean {
  // 수집된 리뷰가 없으면 실패로 간주
  return reviews.length > 0 && reviews.some(r => r.content.length > 0);
}