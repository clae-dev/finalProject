import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

/**
 * 로그인 컴포넌트 (학원 패턴)
 * - useContext로 AuthContext 사용
 * - globalState에서 함수 가져오기
 */

function Login() {
  const globalState = useContext(AuthContext);

  return (
    // [수정] 패딩 반응형 적용
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      {/* [수정] 카드 스타일 개선 - 더 부드러운 그림자, 큰 radius */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 w-full max-w-md border border-gray-100">

        {/* [수정] 로고 영역 - 제주 컬러 적용, 반응형 크기 */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            <span className="text-jeju-500">혼</span>
            <span className="text-emerald-400">행</span>
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
            {/* [수정] 공통 label 스타일 클래스 사용 */}
            <label htmlFor="email" className="label-base">
              이메일
            </label>
            {/* [수정] input 스타일 개선 - focus ring, 접근성 향상 */}
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

          {/* [수정] 버튼 스타일 - 제주 컬러, hover/focus/active 상태 추가 */}
          <button type="submit" className="btn-primary">
            로그인
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            계정이 없으신가요?{' '}
            {/* [수정] 링크 스타일 - 제주 컬러, focus 상태 추가 */}
            <Link
              to="/signup"
              className="text-jeju-500 hover:text-jeju-600 font-semibold
                         focus:outline-none focus-visible:underline transition-colors"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
