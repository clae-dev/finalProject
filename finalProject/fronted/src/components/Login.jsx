import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

/**
 * 로그인 컴포넌트 (수정 버전)
 * - Tailwind v3 호환
 * - 제주 컬러 사용
 */

function Login() {
  const globalState = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-jeju-gradient">
      {/* 카드 */}
      <div className="card-gradient p-6 sm:p-8 w-full max-w-md page-enter hover-lift">

        {/* 로고 */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl mb-2 cursor-pointer">
            <span className="logo-jeju">혼</span>
            <span className="logo-emerald">행</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            제주도 혼자 여행하는 사람들의 커뮤니티
          </p>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
          로그인
        </h2>

        <form onSubmit={globalState.handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="label-base">
              이메일
            </label>
            <input
              type="email"
              id="email"
              required
              value={globalState.email}
              onChange={globalState.changeInputEmail}
              placeholder="example@email.com"
              className="input-base"
            />
          </div>

          <div>
            <label htmlFor="password" className="label-base">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              required
              value={globalState.password}
              onChange={globalState.changeInputPw}
              placeholder="비밀번호 입력"
              className="input-base"
            />
          </div>

          <button type="submit" className="btn-primary">
            로그인
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="link-primary">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;