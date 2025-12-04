import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import type { FormEvent } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import authLogoDesktop from '@/assets/images/auth_logo_desktop.png';
import { registerUser } from '@/services/authService';
import { ApiError } from '@/services/apiClient';

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedName || !password || !passwordConfirm) {
      setErrorMessage('모든 정보를 입력해주세요.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      await registerUser({ email: trimmedEmail, name: trimmedName, password });
      
      // 회원가입 성공 시 즉시 로그인 페이지로 이동
      navigate({ to: '/auth/login' });
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('회원가입 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = !email.trim() || !name.trim() || !password || !passwordConfirm || isSubmitting;
  const passwordsMismatch = Boolean(passwordConfirm) && password !== passwordConfirm;

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
          backgroundRepeat: 'no-repeat',
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
            WebkitTextFillColor: 'transparent',
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
            WebkitTextFillColor: 'transparent',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          Parallel Diary
        </motion.h2>
      </motion.div>

      {/* 회원가입 폼 */}
      <form className="flex flex-col gap-5 w-full mb-8" onSubmit={handleSignup}>
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

        {/* 이름 입력 */}
        <Input
          variant="auth"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          autoComplete="name"
          className="border-transparent"
        />

        {/* 비밀번호 입력 */}
        <Input
          variant="auth"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          autoComplete="new-password"
          className="border-transparent"
        />

        {/* 비밀번호 확인 */}
        <Input
          variant="auth"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="비밀번호 확인"
          autoComplete="new-password"
          className="border-transparent"
        />
        {passwordsMismatch && (
          <p className="text-sm text-[#ff8f8f] -mt-3" role="alert">
            비밀번호가 일치하지 않습니다.
          </p>
        )}

        {errorMessage && (
          <div className="-mt-2" aria-live="polite">
            <p className="text-sm text-[#ff8f8f]">{errorMessage}</p>
          </div>
        )}

        {/* 회원가입 버튼 */}
        <Button 
          variant="auth" 
          type="submit" 
          disabled={isSubmitDisabled} 
          loading={isSubmitting}
          loadingText="가입 중..."
        >
          회원가입
        </Button>
      </form>

      {/* 로그인 링크 */}
      <div className="text-center mb-10">
        <Link
          to="/auth/login"
          className="text-[#bfbfde] text-base hover:text-white underline transition-colors"
          style={{ letterSpacing: '-0.32px' }}
        >
          이미 계정이 있으신가요? 로그인
        </Link>
      </div>
    </motion.div>
  );
}
