import { Router, Request, Response } from 'express';
import { calcTrustScore, calcAdjustedRating } from '../services/trustService';
import { getAISummary } from '../services/aiService';
import { getCachedAnalysis, saveAnalysisResult } from '../db/queries';

const router = Router();

router.post('/analyze', async (req: Request, res: Response) => {
  const { url, productName, originalRating, reviews } = req.body;

  if (!reviews || reviews.length === 0) {
    return res.status(400).json({ success: false, error: { message: '분석할 리뷰가 없습니다.' } });
  }

  try {
    // 1. 캐싱 확인: 이미 분석된 상품이면 DB에서 즉시 반환 (응답 속도 1초 이내)
    const cachedData = await getCachedAnalysis(url);
    if (cachedData) {
      return res.json({
        success: true,
        cached: true,
        data: cachedData
      });
    }

    // 2. 캐시가 없으면 Rule 기반 신뢰도 점수 부여 진행
    const processedReviews = reviews.map((r: any) => {
      const { score, reason } = calcTrustScore(r);
      return { ...r, trustScore: score, adReason: reason };
    });

    const adjustedRating = calcAdjustedRating(processedReviews);
    const trustedReviews = processedReviews.filter((r: any) => r.trustScore >= 50);
    const suspiciousReviews = processedReviews.filter((r: any) => r.trustScore < 50);
    const adRatio = suspiciousReviews.length / reviews.length;

    // 3. AI 기반 요약 요청
    const aiSummary = await getAISummary(trustedReviews);

    const resultData = {
      trustScore: Math.round((trustedReviews.length / reviews.length) * 100) || 0,
      adRatio: parseFloat(adRatio.toFixed(2)),
      originalRating,
      adjustedRating,
      reviewCount: reviews.length,
      trustedReviewCount: trustedReviews.length,
      ...aiSummary,
      suspiciousReviews: suspiciousReviews.map((r: any) => ({
        content: r.content,
        reason: r.adReason,
        trustScore: r.trustScore
      }))
    };

    // 4. 분석 완료 후 DB에 비동기 저장 (사용자 응답 지연을 막기 위해 await 없이 던져두거나, 빠른 반환 후 처리)
    saveAnalysisResult(url, productName, originalRating, resultData).catch(console.error);

    // 5. 프론트엔드로 분석 결과 응답
    res.json({
      success: true,
      cached: false,
      data: resultData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: { message: '서버 연결에 실패했습니다.' } });
  }
});

export default router;