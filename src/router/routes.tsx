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
import DiaryDetailLayout from '../pages/diaries/DiaryDetailLayout';
import BucketListPage from '../pages/BucketListPage';

// 인증 체크 함수
const checkAuth = () => {
  if (typeof window === 'undefined') return false;
  const token = window.localStorage.getItem('accessToken');
  const user = window.localStorage.getItem('user');
  return !!(token && user);
};

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
      date: search.date ? (search.date as string) : undefined, // YYYY-MM-DD 형식
    };
  },
  component: DiaryListPage,
});

// 일기 상세 레이아웃 (공통 배경)
export const diaryDetailLayoutRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/diaries/$id',
  component: DiaryDetailLayout,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      fromCreate: search.fromCreate === 1 ? 1 : undefined,
    };
  },
});

// 원본 일기 상세 페이지 (인덱스 라우트)
export const diaryDetailRoute = createRoute({
  getParentRoute: () => diaryDetailLayoutRoute,
  path: '/',
  component: DiaryDetailPage,
});

// 평행 일기 상세 페이지
export const parallelDetailRoute = createRoute({
  getParentRoute: () => diaryDetailLayoutRoute,
  path: '/parallel',
  component: ParallelDetailPage,
});

// 일상 분석 페이지
export const analysisRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/analysis',
  component: AnalysisPage,
});

// 버킷리스트 페이지
export const bucketListRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/bucketlist',
  component: BucketListPage,
});


