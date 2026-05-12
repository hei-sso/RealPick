import React from 'react';

interface ReviewSummaryProps {
  data: {
    positiveSummary?: string;
    negativeSummary?: string;
    pros?: string[];
    cons?: string[];
    aiUnavailable?: boolean;
  };
}

export default function ReviewSummary({ data }: ReviewSummaryProps) {
  if (data.aiUnavailable) {
    return (
      <div style={{ padding: '30px 0', textAlign: 'center' }}>
        <span style={{ fontSize: '30px', display: 'block', marginBottom: '10px' }}>🤖🔌</span>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>AI 요약을 제공할 수 없습니다.</p>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>신뢰도 점수는 정상 제공됩니다.</p>
      </div>
    );
  }

  const boxStyle = (isPositive: boolean): React.CSSProperties => ({
    backgroundColor: isPositive ? '#eff6ff' : '#fef2f2',
    padding: '12px',
    borderRadius: '8px',
    border: `1px solid ${isPositive ? '#dbeafe' : '#fee2e2'}`,
    marginBottom: '10px'
  });

  const tagStyle = (isPositive: boolean): React.CSSProperties => ({
    backgroundColor: isPositive ? '#dbeafe' : '#fee2e2',
    color: isPositive ? '#1e40af' : '#991b1b',
    fontSize: '10px',
    padding: '3px 8px',
    borderRadius: '999px',
    fontWeight: 'bold',
    marginRight: '4px',
    marginBottom: '4px'
  });

  return (
    <div style={{ paddingRight: '4px' }}>
      <div style={boxStyle(true)}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ marginRight: '4px' }}>👍</span>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e40af' }}>긍정 요약</span>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#374151', lineHeight: '1.5' }}>
          {data.positiveSummary || '긍정 리뷰 부족'}
        </p>
      </div>

      <div style={boxStyle(false)}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ marginRight: '4px' }}>👎</span>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#991b1b' }}>부정 요약</span>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#374151', lineHeight: '1.5' }}>
          {data.negativeSummary || '부정 리뷰 부족'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563', display: 'block', marginBottom: '8px' }}>✅ 장점</span>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {data.pros?.map((pro, i) => <span key={i} style={tagStyle(true)}>{pro}</span>)}
          </div>
        </div>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#4b5563', display: 'block', marginBottom: '8px' }}>❌ 단점</span>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {data.cons?.map((con, i) => <span key={i} style={tagStyle(false)}>{con}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}