import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './rootRoute';
import HomePage from '../pages/HomePage';
import AuthLayout from '../pages/auth/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
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
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

// Auth 레이아웃 라우트 (공통 배경)
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
  component: AuthLayout,
});

// 로그인 페이지
export const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/login',
  component: LoginPage,
});

// 회원가입 페이지
export const signupRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/signup',
  component: SignupPage,
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
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as 'all' | 'date') || 'date',
      date: search.date ? Number(search.date) : undefined,
    };
  },
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


