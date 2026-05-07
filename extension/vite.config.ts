import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  server: {
    port: 5173,          // 포트 번호 고정
    strictPort: true,    // 5173이 겹치면 5174로 넘어가지 않고 에러를 띄움
    hmr: {
      port: 5173,        // 실시간 코드 새로고침(HMR) 포트도 똑같이 고정
    },
    // CORS 에러 해결 (확장 프로그램의 접근을 모두 허용)
    cors: {
      origin: '*', 
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: '*',
    }
  }
});