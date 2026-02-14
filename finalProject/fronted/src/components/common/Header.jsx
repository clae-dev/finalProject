import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import logo from '@/assets/images/logo/혼디.png';
import { AuthContext } from '../AuthContext';
import ChatPanel from '../chatting/ChatPanel';

export default function Header() {
  const { user, handleLogout } = useContext(AuthContext);
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);

  const navItems = [
    { name: '홈', path: '/' },
    { name: '자유', path: '/freeboard' },
    { name: '숙소', path: '/accommodations' },
    { name: '동행', path: '/companions' },
    { name: '후기', path: '/reviews' },
    { name: '맛집', path: '/restaurants' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/80 backdrop-blur-xl border-b border-sky-100/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-18 relative">
              {/* 로고 - 왼쪽 */}
              <Link to="/" className="cursor-pointer flex items-center gap-3 group">
                <img src={logo} alt="혼디" className="h-14 group-hover:scale-105 transition-transform duration-300" />
                <div className="flex flex-col leading-tight">
                  <span
                    className="text-2xl font-black bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent tracking-wider"
                    style={{ fontFamily: "'GmarketSans', sans-serif" }}
                  >
                    HONDI
                  </span>
                  <span
                    className="text-[11px] font-semibold text-slate-400 tracking-widest"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    혼디
                  </span>
                </div>
              </Link>

              {/* 네비게이션 - 중앙 */}
              <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                {navItems.map((item) => {
                  const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`text-[15px] font-semibold px-4 py-2 rounded-xl transition-all duration-500 ${
                        isActive
                          ? 'text-sky-600'
                          : 'text-slate-500 hover:text-white hover:bg-sky-400'
                      }`}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* 오른쪽 - 채팅 + 로그인/로그아웃 */}
              <div className="flex items-center gap-3">
                {user ? (
                  <>
                    {/* 채팅 아이콘 */}
                    <button
                      onClick={() => setChatOpen(true)}
                      className="relative group w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center shadow-md shadow-sky-200/50 hover:shadow-lg hover:shadow-sky-300/50 hover:scale-110 active:scale-95 transition-all duration-300"
                      title="메시지"
                    >
                      <MessageCircle className="w-5 h-5 text-white stroke-[2.5] group-hover:rotate-12 transition-transform duration-300" />
                    </button>

                    <Link
                      to="/mypage"
                      className="text-sm text-slate-600 hidden sm:block font-medium hover:text-sky-500 transition-colors"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      {user.memberNickname}님
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-bold rounded-full shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/50 hover:scale-105 transition-all duration-300"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-bold rounded-full shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/50 hover:scale-105 transition-all duration-300"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    로그인
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 채팅 슬라이드 패널 */}
      {user && (
        <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      )}
    </>
  );
}
