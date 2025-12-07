import { defineConfig, loadEnv } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [devtools(), viteReact(), svgr(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api/naver': {
          target: 'https://openapi.naver.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/naver/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // loadEnv로 로드한 환경 변수 사용
              const clientId = env.VITE_NAVER_CLIENT_ID;
              const clientSecret = env.VITE_NAVER_CLIENT_SECRET;
              
              if (clientId && clientSecret) {
                proxyReq.setHeader('X-Naver-Client-Id', clientId);
                proxyReq.setHeader('X-Naver-Client-Secret', clientSecret);
                console.log('✅ 네이버 API 키 헤더 추가됨');
              } else {
                console.error('❌ 네이버 API 키를 찾을 수 없습니다!');
              }
            });
          },
        },
        '/api/ai': {
          target: 'http://43.202.81.16:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/ai/, ''),
        },
        '/api': {
          target: 'http://3.105.9.139:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
