import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze'; // 이전에 작성한 분석 라우터 연결

// 환경변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 설정: 크롬 확장 프로그램에서 오는 요청을 허용
// 개발 및 시연 단계에서는 모든 출처를 임시 허용하고, 실제 배포 시 extension ID만 허용하도록 변경합니다.
app.use(cors({
  origin: '*', // 배포 시 'chrome-extension://확장_프로그램_ID' 형태로 제한 권장
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON 형태의 요청 Body 파싱 미들웨어
app.use(express.json());

// API 라우터 마운트
app.use('/api', analyzeRouter);

// Health Check 엔드포인트: Railway 배포 상태 및 서버 정상 기동 확인용
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Real Pick API Server is running smoothly.'
  });
});

// 404 에러 처리 미들웨어
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: { message: '존재하지 않는 API 엔드포인트입니다.' } });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Real Pick Server is running on http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
});

export default app;