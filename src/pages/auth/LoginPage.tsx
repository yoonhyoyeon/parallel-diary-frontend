import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import type { FormEvent } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import authLogoDesktop from '@/assets/images/auth_logo_desktop.png';
import { loginUser } from '@/services/authService';
import { ApiError } from '@/services/apiClient';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMessage('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await loginUser({ email: trimmedEmail, password });
      
      // AuthContext를 통해 로그인 상태 저장
      login(response.accessToken, response.user);

      // 홈으로 이동
      navigate({ to: '/' });
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google 로그인');
  };

  const handleKakaoLogin = () => {
    console.log('Kakao 로그인');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col w-full"
    >
      {/* 로고 */}
      <motion.div 
        className="mb-16"
        style={{
          backgroundImage: `url(${authLogoDesktop})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h1 
          className="text-[44px] font-extrabold mb-2 bg-clip-text text-transparent"
          style={{ 
            letterSpacing: '-0.8px',
            background: 'linear-gradient(90deg, #F2F3FF 0%, #C7C8FF 16.83%, #656FC9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          평행일기
        </motion.h1>
        <motion.h2 
          className="text-[44px] font-bold bg-clip-text text-transparent"
          style={{ 
            letterSpacing: '-2px',
            background: 'linear-gradient(90deg, #F2F3FF 0%, #C7C8FF 16.83%, #656FC9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          Parallel Diary
        </motion.h2>
      </motion.div>

      {/* 로그인 폼 */}
      <form className="flex flex-col gap-5 w-full mb-8" onSubmit={handleLogin}>
        {/* 이메일 입력 */}
        <Input
          variant="auth"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          autoComplete="email"
          className="border-transparent"
        />

        {/* 비밀번호 입력 */}
        <Input
          variant="auth"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          autoComplete="current-password"
          className="border-transparent"
        />

        {errorMessage && (
          <div className="-mt-2" aria-live="polite">
            <p className="text-sm text-[#ff8f8f]">{errorMessage}</p>
          </div>
        )}

        {/* 로그인 버튼 */}
        <Button
          variant="auth"
          type="submit"
          disabled={!email.trim() || !password || isSubmitting}
          loading={isSubmitting}
        >
          로그인
        </Button>
      </form>

      {/* 회원가입 링크 */}
      <div className="text-center mb-10">
        <Link
          to="/auth/signup"
          className="text-[#bfbfde] text-base hover:text-white underline transition-colors"
          style={{ letterSpacing: '-0.32px' }}
        >
          회원가입
        </Link>
      </div>

      {/* 구분선 */}
      <div className="flex items-center gap-4 w-full mb-8">
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-600 to-transparent" />
        <span className="text-white text-base" style={{ letterSpacing: '-0.32px' }}>or</span>
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-600 to-transparent" />
      </div>

      {/* 소셜 로그인 */}
      <div className="flex gap-3 w-full">
        <Button
          variant="google"
          onClick={handleGoogleLogin}
          icon={{
            component: (
              <img 
                src="/figma-assets/2e0625474d8cf189ba7ae94e1817240f8f0e5c90.png" 
                alt=""
                className="w-6 h-6"
              />
            ),
            position: 'left'
          }}
        >
          Google
        </Button>

        <Button
          variant="kakao"
          onClick={handleKakaoLogin}
          icon={{
            component: (
              <img 
                src="/figma-assets/409cfb033f6ddd1a1f86f3c1d440595a02a85954.png" 
                alt=""
                className="w-8 h-8"
              />
            ),
            position: 'left'
          }}
        >
          Kakao
        </Button>
      </div>
    </motion.div>
  );
}

