import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import Input from '@/components/Input';
import Button from '@/components/Button';
import authLogoDesktop from '@/assets/images/auth_logo_desktop.png';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSignup = () => {
    console.log('회원가입:', { email, name, password, passwordConfirm });
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

      {/* 회원가입 폼 */}
      <div className="flex flex-col gap-5 w-full mb-8">
        {/* 이메일 입력 */}
        <Input
          variant="auth"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="border-transparent"
        />

        {/* 이름 입력 */}
        <Input
          variant="auth"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="border-transparent"
        />

        {/* 비밀번호 입력 */}
        <Input
          variant="auth"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="border-transparent"
        />

        {/* 비밀번호 확인 */}
        <Input
          variant="auth"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="비밀번호 확인"
          className="border-transparent"
        />

        {/* 회원가입 버튼 */}
        <Button
          variant="auth"
          onClick={handleSignup}
        >
          회원가입
        </Button>
      </div>

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

