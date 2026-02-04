import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/혼디.png';
import { AuthContext } from '../AuthContext';

export default function Header() {
  const { user, handleLogout } = useContext(AuthContext);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/70 backdrop-blur-xl border-b border-sky-100">
        <div className="w-full px-5">
          <div className="flex items-center justify-between h-16 relative">
            {/* 로고 - 왼쪽 */}
            <h1 className="cursor-pointer flex items-center gap-2">
              <img src={logo} alt="혼디" className="h-16" />
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent tracking-wide">HONDI</span>
                <span className="text-xs font-medium text-slate-400">혼디</span>
              </div>
            </h1>

            {/* 네비게이션 - 중앙 */}
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {['홈', '숙소', '동행', '후기', '맛집'].map((item, idx) => (
                <button key={item} className={`text-sm font-medium transition-colors ${idx === 0 ? 'text-sky-600' : 'text-slate-500 hover:text-sky-500'}`}>
                  {item}
                </button>
              ))}
            </nav>

            {/* 오른쪽 - 로그인/로그아웃 */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-slate-600 hidden sm:block">
                    {user.memberNickname}님
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-semibold rounded-full shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-semibold rounded-full shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}