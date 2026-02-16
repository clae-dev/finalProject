import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Shield, ChevronDown, Plane, Hotel, CalendarDays, Users, MessageSquare, Star } from 'lucide-react';
import logo from '@/assets/images/logo/혼디.png';
import { AuthContext } from '../AuthContext';
import ChatPanel from '../chatting/ChatPanel';

const navItems = [
  {
    name: '여행',
    type: 'dropdown',
    children: [
      { name: '숙소', path: '/accommodations', icon: <Hotel className="w-4 h-4" />, desc: '제주 숙소 검색' },
      { name: '항공권', path: '/flights', icon: <Plane className="w-4 h-4" />, desc: '항공권 비교 예약' },
      { name: '이벤트', path: '/activities', icon: <CalendarDays className="w-4 h-4" />, desc: '행사 · 액티비티' },
    ],
  },
  {
    name: '커뮤니티',
    type: 'dropdown',
    children: [
      { name: '자유게시판', path: '/freeboard', icon: <MessageSquare className="w-4 h-4" />, desc: '자유롭게 소통' },
      { name: '동행찾기', path: '/companions', icon: <Users className="w-4 h-4" />, desc: '여행 동행 모집' },
      { name: '여행후기', path: '/reviews', icon: <Star className="w-4 h-4" />, desc: '생생한 후기' },
    ],
  },
  { name: '고객지원', path: '/faq', type: 'link' },
];

function DropdownMenu({ item, isActive, isOpen, onOpen, onClose }) {
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpen();
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => onClose(), 150);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1 text-[15px] font-semibold px-4 py-2 rounded-xl transition-all duration-300 ${
          isActive
            ? 'text-sky-600'
            : 'text-slate-500 hover:text-white hover:bg-sky-400'
        }`}
        style={{ fontFamily: "'Pretendard', sans-serif" }}
      >
        {item.name}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 드롭다운 패널 */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-sky-100/60 shadow-xl shadow-sky-100/30 p-2 min-w-[220px]">
          {item.children.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-50 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-50 group-hover:bg-sky-100 flex items-center justify-center text-sky-500 transition-colors duration-200">
                {child.icon}
              </div>
              <div>
                <p
                  className="text-sm font-semibold text-slate-700 group-hover:text-sky-600 transition-colors"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  {child.name}
                </p>
                <p
                  className="text-[11px] text-slate-400"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  {child.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const { user, handleLogout } = useContext(AuthContext);
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const isPathActive = (item) => {
    if (item.type === 'link') {
      return item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
    }
    if (item.type === 'dropdown') {
      return item.children.some((child) => location.pathname.startsWith(child.path));
    }
    return false;
  };

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
              <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                {navItems.map((item) => {
                  const isActive = isPathActive(item);

                  if (item.type === 'dropdown') {
                    return (
                      <DropdownMenu
                        key={item.name}
                        item={item}
                        isActive={isActive}
                        isOpen={openDropdown === item.name}
                        onOpen={() => setOpenDropdown(item.name)}
                        onClose={() => setOpenDropdown(null)}
                      />
                    );
                  }

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
                    {/* 관리자 아이콘 */}
                    {user.memberRole === 'A' && (
                      <Link
                        to="/admin"
                        className="relative group w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center shadow-md shadow-violet-200/50 hover:shadow-lg hover:shadow-violet-300/50 hover:scale-110 active:scale-95 transition-all duration-300"
                        title="관리자"
                      >
                        <Shield className="w-5 h-5 text-white stroke-[2.5] group-hover:rotate-12 transition-transform duration-300" />
                      </Link>
                    )}

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
                      className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-sky-500 font-bold text-sm shadow-md shadow-sky-200/50 overflow-hidden">
                        {user.memberProfileImg ? (
                          <img src={user.memberProfileImg} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = user.memberNickname?.[0] || '?'; }} />
                        ) : (
                          user.memberNickname?.[0] || '?'
                        )}
                      </div>
                      <span
                        className="text-sm text-slate-600 font-medium hover:text-sky-500 transition-colors"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        {user.memberNickname}님
                      </span>
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
