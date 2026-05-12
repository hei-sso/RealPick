import React from 'react';

interface SuspiciousReview {
  content: string;
  reason: string;
  trustScore: number;
}

export default function SuspiciousList({ list, totalRatio }: { list: SuspiciousReview[], totalRatio: number }) {
  if (!list || list.length === 0) {
    return (
      <div style={{ padding: '30px 0', textAlign: 'center' }}>
        <span style={{ fontSize: '30px', display: 'block', marginBottom: '10px' }}>✨</span>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>의심 리뷰가 없습니다!</p>
      </div>
    );
  }

  return (
    <div style={{ paddingRight: '4px' }}>
      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '12px' }}>
        ⚠️ 의심 리뷰 {list.length}개 ({Math.round(totalRatio * 100)}%)
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {list.map((review, idx) => (
          <div key={idx} style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                {review.reason.includes('광고') ? '🔴' : '🟡'} {review.reason}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#4b5563', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              "{review.content}"
            </p>
            <div style={{ marginTop: '8px', textAlign: 'right' }}>
              <span style={{ fontSize: '10px', color: '#9ca3af' }}>신뢰도: {review.trustScore}점</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}