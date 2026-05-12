export interface Review {
  content: string;
  rating: number;
  writtenAt: string;
}

export function getProductRating(): number {
  // 평점 클래스 Q12I4dlBzm
  const ratingElement = document.querySelector('.Q12I4dlBzm');
  
  if (ratingElement) {
    // strong 태그의 자식들 중에서 '텍스트'만 골라냄
    // SVG(별 아이콘)와 span.blind(총 5점 중)를 제외한 마지막 텍스트가 평점임
    const nodes = Array.from(ratingElement.childNodes);
    const textNode = nodes.find(node => 
      node.nodeType === Node.TEXT_NODE && node.textContent?.trim().length! > 0
    );

    if (textNode && textNode.textContent) {
      const rating = parseFloat(textNode.textContent.trim());
      console.log("Real Pick - 수집된 평점:", rating); // 개발자 도구에서 확인 가능
      return rating;
    }
  }
  return 0;
}

export function scrapeReviews(): Review[] {
  // 1. 보내주신 HTML 기반 최신 셀렉터 (R6oZvO14r0)
  // 스마트스토어와 브랜드스토어의 최신 목록 형태
  let reviewItems = document.querySelectorAll('li.R6oZvO14r0');
  
  // 2. 만약 위 셀렉터로 못 찾았다면, 일반적인 네이버 쇼핑 셀렉터로 재시도
  if (reviewItems.length === 0) {
    reviewItems = document.querySelectorAll('[class*="reviewItems_review_item"]');
  }

  // 3. 그래도 없다면? (사용자가 아직 리뷰 영역까지 스크롤을 안 했을 확률 99%)
  if (reviewItems.length === 0) {
    console.warn("Real Pick: 리뷰 요소를 찾을 수 없습니다. 리뷰 영역이 보이도록 스크롤을 내려주세요.");
    return [];
  }

  // 최대 50개까지만 수집 (성능 및 AI 처리 비용 고려)
  return Array.from(reviewItems).slice(0, 50).map((el) => {
    // 본문 내용 추출 (W2ktnZBARU 또는 일반 텍스트 클래스)
    const content = 
      el.querySelector('.W2ktnZBARU')?.textContent?.trim() || 
      el.querySelector('[class*="reviewItems_text"]')?.textContent?.trim() || 
      "내용 없음";

    // 별점 추출 (rADCENdRMh 내부의 숫자 추출)
    const ratingElement = el.querySelector('.rADCENdRMh, [class*="reviewItems_average"]');
    const ratingText = ratingElement?.textContent || "5";
    const rating = parseInt(ratingText.replace(/[^0-9]/g, "")) || 5;

    // 작성일 추출 (ajq1FpKeRA 클래스 중 보통 두 번째 요소)
    const dateElements = el.querySelectorAll('.ajq1FpKeRA, [class*="reviewItems_date"]');
    const writtenAt = dateElements.length > 1 
      ? dateElements[1].textContent?.trim() || "" 
      : dateElements[0]?.textContent?.trim() || "";

    return {
      content,
      rating,
      writtenAt
    };
  });
}

// 수집된 리뷰 데이터가 유효한지 검사
export function validateReviews(reviews: Review[]): boolean {
  // 리뷰가 하나도 없거나, 모든 리뷰의 내용이 비어있으면 false
  return reviews.length > 0 && reviews.some(r => r.content.length > 5);
}