import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import logo from '@/assets/images/혼디.png';

function Login() {
  const globalState = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden">
      {/* 제주 바다 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1600"
          alt="제주 바다"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/70 via-cyan-500/60 to-blue-500/70" />
      </div>

      {/* 배경 장식 */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* 파도 배경 */}
      <svg className="absolute bottom-0 w-full opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="white" d="M0,160 C200,200 400,120 600,160 C800,200 1000,120 1200,160 C1350,180 1440,140 1440,140 L1440,320 L0,320 Z" />
      </svg>

      {/* 로그인 카드 */}
      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-sky-900/30 p-10 border border-white/50">
          {/* 로고 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <img src={logo} alt="혼디" className="h-20" />
              <div className="flex flex-col leading-tight text-left">
                <span className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent tracking-wide">HONDI</span>
                <span className="text-sm font-medium text-slate-400">혼디</span>
              </div>
            </div>
            <p className="text-slate-500">제주 바다처럼 자유로운 여행</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-full text-xs font-medium text-sky-600 mt-4">
              <span>🏝️</span>
              <span>나만의 여행을 시작하세요</span>
            </div>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={globalState.handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">이메일</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={globalState.email}
                  onChange={globalState.changeInputEmail}
                  className="h-12 pl-12 bg-slate-50 border-slate-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={globalState.password}
                  onChange={globalState.changeInputPw}
                  className="h-12 pl-12 pr-12 bg-slate-50 border-slate-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  className="border-slate-300"
                />
                <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                  로그인 유지
                </label>
              </div>
              <button type="button" className="text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors">
                비밀번호 찾기
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold text-base rounded-xl shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all"
            >
              로그인
            </Button>
          </form>

          {/* 구분선 */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm text-slate-400">또는</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* 소셜 로그인 */}
          <div className="space-y-3">
            <button className="w-full h-12 flex items-center justify-center gap-3 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-slate-700">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 계속하기
            </button>

            <button className="w-full h-12 flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#FDD835] rounded-xl transition-all font-medium text-slate-800 shadow-md hover:shadow-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#3C1E1E" d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.31 4.73 6.73-.21.78-.77 2.83-.88 3.27-.14.55.2.54.42.4.18-.12 2.85-1.94 4-2.71.56.09 1.14.13 1.73.13 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
              </svg>
              카카오로 계속하기
            </button>

            <button className="w-full h-12 flex items-center justify-center gap-3 bg-[#03C75A] hover:bg-[#02B350] text-white rounded-xl transition-all font-medium shadow-md hover:shadow-lg">
              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              네이버로 계속하기
            </button>
          </div>

          {/* 회원가입 링크 */}
          <div className="text-center mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              아직 회원이 아니신가요?{' '}
              <Link to="/signup" className="text-sky-600 hover:text-sky-700 font-semibold transition-colors">
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* 하단 장식 텍스트 */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-white/90 text-sm drop-shadow font-medium">
            🌊 파도 소리와 함께 나만의 시간을 시작하세요
          </p>
          <p className="text-white/70 text-xs drop-shadow">
            제주의 푸른 바다가 당신을 기다리고 있어요
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
