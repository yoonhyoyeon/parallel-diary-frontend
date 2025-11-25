import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getProfile } from '@/services/authService';

interface User {
  id: string;
  email: string;
  name: string;
  provider: string;
  providerId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드 시 토큰 검증 및 인증 정보 복원
  useEffect(() => {
    const verifyAndRestoreAuth = async () => {
      try {
        const storedToken = window.localStorage.getItem('accessToken');

        if (storedToken) {
          // 토큰으로 프로필 조회하여 유효성 검증
          const profile = await getProfile(storedToken);
          setAccessToken(storedToken);
          setUser(profile);
          // localStorage의 user 정보도 최신화
          window.localStorage.setItem('user', JSON.stringify(profile));
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        // 토큰 만료 또는 무효 - 인증 정보 제거
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAndRestoreAuth();
  }, []);

  const login = (token: string, userData: User) => {
    setAccessToken(token);
    setUser(userData);
    window.localStorage.setItem('accessToken', token);
    window.localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('user');
  };

  const refreshUser = async () => {
    if (!accessToken) return;

    try {
      const profile = await getProfile(accessToken);
      setUser(profile);
      window.localStorage.setItem('user', JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // 토큰 만료 시 로그아웃
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated: !!accessToken && !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

