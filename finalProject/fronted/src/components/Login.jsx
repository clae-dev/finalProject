import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { getSavedEmail, saveEmail, removeSavedEmail } from '../api/core/tokenStorage';
import logo from '@/assets/images/logo/혼디.webp';
import bgImage from '@/assets/images/auth/협재.webp';

function Login() {
  const globalState = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [saveId, setSaveId] = useState(false);

  // 저장된 이메일 불러오기
  useEffect(() => {
    const saved = getSavedEmail();
    if (saved) {
      setSaveId(true);
      globalState.changeInputEmail({ target: { value: saved } });
    }
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || '';

  const handleSocialLogin = (provider) => {
    window.location.href = `${API_URL}/oauth2/authorization/${provider}`;
  };

  const handleGoogleLogin = () => handleSocialLogin("google");
  const handleKakaoLogin = () => handleSocialLogin("kakao");
  const handleNaverLogin = () => handleSocialLogin("naver");

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0">
        <img src={bgImage} alt="협재 해변" loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/50 via-sky-800/40 to-cyan-900/50" />
      </div>

      {/* 로그인 카드 */}
      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-sky-900/30 p-10 border border-white/50">
          {/* 홈으로 */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-sky-500 font-medium transition-colors duration-300 mb-6 font-pretendard"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </button>

          {/* 로고 */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={logo} alt="혼디" className="h-16" />
              <div className="flex flex-col leading-tight text-left">
                <span
                  className="text-3xl font-black bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent tracking-wider font-gmarket"
                >
                  HONDI
                </span>
                <span
                  className="text-[11px] font-semibold text-slate-400 tracking-widest font-pretendard"
                >
                  혼디
                </span>
              </div>
            </div>
            <p
              className="text-slate-400 text-sm font-pretendard"
            >
              나만의 제주 여행을 시작하세요
            </p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={(e) => {
            if (saveId) { saveEmail(globalState.email); } else { removeSavedEmail(); }
            globalState.handleLogin(e);
          }} className="space-y-5">
            <div>
              <label
                className="block text-sm font-semibold text-slate-600 mb-2 font-pretendard"
              >
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={globalState.email}
                  onChange={globalState.changeInputEmail}
                  autoComplete="off"
                  className="h-12 pl-12 bg-slate-50/80 border-slate-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm font-pretendard"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-semibold text-slate-600 mb-2 font-pretendard"
              >
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={globalState.password}
                  onChange={globalState.changeInputPw}
                  autoComplete="new-password"
                  className="h-12 pl-12 pr-12 bg-slate-50/80 border-slate-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm font-pretendard"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="saveId"
                  checked={saveId}
                  onCheckedChange={setSaveId}
                  className="border-slate-300"
                />
                <label
                  htmlFor="saveId"
                  className="text-sm text-slate-500 cursor-pointer font-pretendard"
                >
                  아이디 저장
                </label>
              </div>
              <Link
                to="/find-password"
                className="text-sm text-sky-500 hover:text-sky-600 font-medium transition-colors font-pretendard"
              >
                비밀번호 찾기
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-[15px] rounded-xl shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/50 hover:scale-[1.02] transition-all duration-300 font-pretendard"
            >
              로그인
            </Button>
          </form>

          {/* 구분선 */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-200" />
            <span
              className="text-xs text-slate-400 tracking-wider font-pretendard"
            >
              간편 로그인
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* 소셜 로그인 - 아이콘만 가로 배치 */}
          <div className="flex justify-center gap-5">
            <button
              onClick={handleGoogleLogin}
              className="w-14 h-14 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            <button
              onClick={handleKakaoLogin}
              className="w-14 h-14 flex items-center justify-center bg-[#FEE500] rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#3C1E1E" d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.31 4.73 6.73-.21.78-.77 2.83-.88 3.27-.14.55.2.54.42.4.18-.12 2.85-1.94 4-2.71.56.09 1.14.13 1.73.13 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
              </svg>
            </button>

            <button
              onClick={handleNaverLogin}
              className="w-14 h-14 flex items-center justify-center bg-[#03C75A] rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
            </button>
          </div>

          {/* 회원가입 링크 */}
          <div className="text-center mt-8 pt-6 border-t border-slate-100">
            <p
              className="text-sm text-slate-500 font-pretendard"
            >
              아직 회원이 아니신가요?{' '}
              <Link to="/signup" className="text-sky-500 hover:text-sky-600 font-bold transition-colors">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
