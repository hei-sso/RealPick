import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ReviewData {
  content: string;
  rating: number;
}

export interface AISummaryResult {
  positiveSummary: string | null;
  negativeSummary: string | null;
  pros: string[];
  cons: string[];
  conclusion: '구매 추천' | '고민 필요' | null;
  aiUnavailable?: boolean;
}

export async function getAISummary(trustedReviews: ReviewData[]): Promise<AISummaryResult> {
  // 신뢰 리뷰가 너무 적으면 분석 불가 처리
  if (!trustedReviews || trustedReviews.length < 3) {
    return {
      positiveSummary: '신뢰할 수 있는 리뷰 개수가 부족하여 AI 요약을 제공할 수 없습니다.',
      negativeSummary: '신뢰할 수 있는 리뷰 개수가 부족하여 AI 요약을 제공할 수 없습니다.',
      pros: [],
      cons: [],
      conclusion: '고민 필요',
      aiUnavailable: true
    };
  }

  // 리뷰 텍스트 조립 (토큰 절약을 위해 리뷰당 최대 길이를 제한할 수 있습니다)
  const reviewsText = trustedReviews
    .map((r, i) => `[리뷰${i + 1}/별점${r.rating}] ${r.content}`)
    .join('\n');

  // 시스템 프롬프트 정의
  const systemPrompt = `
  당신은 전자제품 구매를 도와주는 AI 쇼핑 컨설턴트입니다.
  사용자가 제공한 리뷰 목록을 분석하여, 다음 JSON 형식으로만 응답하세요.
  
  {
    "positiveSummary": "전체적인 긍정 평가를 1~2문장으로 요약",
    "negativeSummary": "전체적인 부정 평가를 1~2문장으로 요약",
    "pros": ["가장 자주 언급된 장점 키워드 3개"],
    "cons": ["가장 자주 언급된 단점 키워드 3개"],
    "conclusion": "구매 추천" 또는 "고민 필요" 중 택 1
  }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `다음 리뷰들을 분석해주세요:\n\n${reviewsText}` }
      ],
      response_format: { type: 'json_object' }, // JSON 강제 반환
      temperature: 0.3, // 일관된 답변을 위해 낮게 설정
    });

    const resultText = response.choices[0].message.content;
    if (!resultText) throw new Error('AI 응답이 비어있습니다.');

    const parsedData = JSON.parse(resultText);

    return {
      positiveSummary: parsedData.positiveSummary,
      negativeSummary: parsedData.negativeSummary,
      pros: parsedData.pros || [],
      cons: parsedData.cons || [],
      conclusion: parsedData.conclusion === '구매 추천' ? '구매 추천' : '고민 필요',
    };

  } catch (error) {
    console.error('OpenAI API 호출 에러:', error);
    // API 에러 시 프론트엔드에서 예외 처리를 할 수 있도록 플래그 반환
    return {
      positiveSummary: null,
      negativeSummary: null,
      pros: [],
      cons: [],
      conclusion: null,
      aiUnavailable: true
    };
  }
}