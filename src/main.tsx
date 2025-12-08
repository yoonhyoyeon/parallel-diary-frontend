import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { ActivityDetailProvider } from './contexts/ActivityDetailContext';

import './styles.css';

// Router is created in src/router/index.ts

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider>
        <ActivityDetailProvider>
          <RouterProvider router={router} />
        </ActivityDetailProvider>
      </AuthProvider>
    </StrictMode>,
  );
}
