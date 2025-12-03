import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { registerSW } from 'virtual:pwa-register';

import './styles.css';

// Router is created in src/router/index.ts

// PWA Service Worker 등록
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('새로운 버전이 있습니다. 업데이트하시겠습니까?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('앱이 오프라인에서 사용 가능합니다.');
  },
});

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider>
      <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>,
  );
}
