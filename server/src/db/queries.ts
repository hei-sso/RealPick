// 임시 MVP 버전
export async function getCachedAnalysis(url: string): Promise<any | null> {
  // DB가 없으므로 항상 '캐시 없음(null)'을 반환하여 실시간 AI 분석을 강제함
  return null;
}

export async function saveAnalysisResult(
  url: string, 
  productName: string, 
  originalRating: number, 
  resultData: any
): Promise<void> {
  // DB가 없으므로 저장은 건너뛰고 콘솔에 로그 찍기
  console.log(`[임시 모드] DB가 없어 저장을 건너뜁니다: ${productName}`);
}

/*
import pool from './connection';
import crypto from 'crypto';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// URL을 고유한 해시로 변환
function getUrlHash(url: string): string {
  return crypto.createHash('md5').update(url).digest('hex');
}

// 1. 캐싱된 분석 결과 조회
export async function getCachedAnalysis(url: string): Promise<any | null> {
  const urlHash = getUrlHash(url);
  
  const query = `
    SELECT a.*, p.name as productName, p.original_rating 
    FROM analysis_results a
    JOIN products p ON a.product_id = p.id
    WHERE p.url_hash = ?
  `;

  const [rows] = await pool.execute<RowDataPacket[]>(query, [urlHash]);
  
  if (rows.length > 0) {
    const row = rows[0];
    // DB의 JSON 컬럼은 mysql2가 객체로 파싱해주지만, 문자열일 경우를 대비
    return {
      trustScore: row.trust_score,
      adRatio: row.ad_ratio,
      originalRating: row.original_rating,
      adjustedRating: row.adjusted_rating,
      reviewCount: row.review_count,
      trustedReviewCount: row.trusted_review_count,
      positiveSummary: row.positive_summary,
      negativeSummary: row.negative_summary,
      pros: typeof row.pros === 'string' ? JSON.parse(row.pros) : row.pros,
      cons: typeof row.cons === 'string' ? JSON.parse(row.cons) : row.cons,
      conclusion: row.conclusion,
      // 의심 리뷰 목록은 MVP 단계에서 DB 저장/조회 복잡도를 낮추기 위해 캐시 조회 시 생략하거나 별도 테이블에서 가져올 수 있습니다.
      suspiciousReviews: [] 
    };
  }
  return null;
}

// 2. 새로운 분석 결과 DB 저장
export async function saveAnalysisResult(
  url: string, 
  productName: string, 
  originalRating: number, 
  resultData: any
): Promise<void> {
  const urlHash = getUrlHash(url);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1) products 테이블에 상품 삽입 (이미 존재하면 무시)
    const insertProductQuery = `
      INSERT IGNORE INTO products (name, url, url_hash, platform, original_rating)
      VALUES (?, ?, ?, 'naver', ?)
    `;
    const [productResult] = await connection.execute<ResultSetHeader>(
      insertProductQuery, 
      [productName, url, urlHash, originalRating]
    );

    // 삽입된 상품 ID 가져오기 (IGNORE로 삽입 안 된 경우 SELECT로 조회)
    let productId = productResult.insertId;
    if (productId === 0) {
      const [existingProduct] = await connection.execute<RowDataPacket[]>(
        `SELECT id FROM products WHERE url_hash = ?`, [urlHash]
      );
      productId = existingProduct[0].id;
    }

    // 2) analysis_results 테이블에 분석 결과 저장 (중복 시 업데이트)
    const insertAnalysisQuery = `
      INSERT INTO analysis_results 
      (product_id, trust_score, ad_ratio, original_rating, adjusted_rating, review_count, trusted_review_count, positive_summary, negative_summary, pros, cons, conclusion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        trust_score = VALUES(trust_score),
        ad_ratio = VALUES(ad_ratio),
        adjusted_rating = VALUES(adjusted_rating),
        positive_summary = VALUES(positive_summary),
        negative_summary = VALUES(negative_summary),
        pros = VALUES(pros),
        cons = VALUES(cons),
        conclusion = VALUES(conclusion),
        analyzed_at = CURRENT_TIMESTAMP
    `;

    await connection.execute(insertAnalysisQuery, [
      productId,
      resultData.trustScore,
      resultData.adRatio,
      resultData.originalRating,
      resultData.adjustedRating,
      resultData.reviewCount,
      resultData.trustedReviewCount,
      resultData.positiveSummary,
      resultData.negativeSummary,
      JSON.stringify(resultData.pros),
      JSON.stringify(resultData.cons),
      resultData.conclusion
    ]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('DB 저장 중 에러 발생:', error);
  } finally {
    connection.release();
  }
}
*/