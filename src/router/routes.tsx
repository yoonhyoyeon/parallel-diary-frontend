import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './rootRoute';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import CreatePage from '../pages/CreatePage';
import DiaryListPage from '../pages/DiaryListPage';
import DiaryDetailPage from '../pages/DiaryDetailPage';
import ParallelDetailPage from '../pages/ParallelDetailPage';
import AnalysisPage from '../pages/AnalysisPage';

// 임시 인증 체크 함수 
const checkAuth = () => {
  return true;
}

// 보호된 라우트 그룹 (인증 필요)
export const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  beforeLoad: ({ location }) => {
    const isAuthenticated = checkAuth();
    if (!isAuthenticated) {
      throw redirect({
        to: '/auth',
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

// 인증 페이지 (로그인하면 접근 불가)
export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  beforeLoad: () => {
    const isAuthenticated = checkAuth();
    if (isAuthenticated) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: AuthPage,
});

// 홈 페이지
export const indexRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/',
  component: HomePage,
});

// 일기 생성 페이지
export const createPageRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/create',
  component: CreatePage,
});

// 일기 목록 페이지
export const diariesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/diaries',
  component: DiaryListPage,
});

// 원본 일기 상세 페이지
export const diaryDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/diaries/$id',
  component: DiaryDetailPage,
});

// 평행 일기 상세 페이지
export const parallelDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/diaries/$id/parallel',
  component: ParallelDetailPage,
});

// 일상 분석 페이지
export const analysisRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/analysis',
  component: AnalysisPage,
});


