import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, Building2, MapPin,
  MessageCircleQuestion, Megaphone, Flag, Mail, Footprints,
  ShieldCheck, ChevronRight, LogOut, Menu, X, Shield, Home,
} from 'lucide-react';
import AdminDashboard     from '../../components/admin/AdminDashboard';
import AdminMembers       from '../../components/admin/AdminMembers';
import AdminPosts         from '../../components/admin/AdminPosts';
import AdminAccommodations from '../../components/admin/AdminAccommodations';
import AdminSpots         from '../../components/admin/AdminSpots';
import AdminFaq           from '../../components/admin/AdminFaq';
import AdminNotices       from '../../components/admin/AdminNotices';
import AdminReports       from '../../components/admin/AdminReports';
import AdminVerifications from '../../components/admin/AdminVerifications';
import AdminInquiry       from '../../components/admin/AdminInquiry';
import AdminOlleTrails    from '../../components/admin/AdminOlleTrails';
import { AuthContext }    from '../../components/AuthContext';

/* ── 사이드바 메뉴 정의 ── */
const MENU_GROUPS = [
  {
    label: '개요',
    items: [
      { key: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    ],
  },
  {
    label: '사용자',
    items: [
      { key: 'members', label: '회원 관리', icon: Users },
    ],
  },
  {
    label: '콘텐츠',
    items: [
      { key: 'posts',      label: '게시물 관리', icon: FileText },
      { key: 'notices',    label: '공지 관리',   icon: Megaphone },
      { key: 'faq',        label: 'FAQ 관리',    icon: MessageCircleQuestion },
      { key: 'olletrails', label: '올레길 관리', icon: Footprints },
    ],
  },
  {
    label: '서비스',
    items: [
      { key: 'accommodations', label: '숙소 관리', icon: Building2 },
      { key: 'spots',          label: '명소 관리', icon: MapPin },
    ],
  },
  {
    label: '운영',
    items: [
      { key: 'verifications', label: '인증 관리', icon: ShieldCheck },
      { key: 'reports',       label: '신고 관리', icon: Flag },
      { key: 'inquiry',       label: '문의 관리', icon: Mail },
    ],
  },
];

const PAGE_LABEL = Object.fromEntries(
  MENU_GROUPS.flatMap((g) => g.items.map((i) => [i.key, i.label]))
);

/* ── 컴포넌트 맵 ── */
const PANEL = {
  dashboard:      <AdminDashboard />,
  members:        <AdminMembers />,
  posts:          <AdminPosts />,
  accommodations: <AdminAccommodations />,
  spots:          <AdminSpots />,
  faq:            <AdminFaq />,
  notices:        <AdminNotices />,
  verifications:  <AdminVerifications />,
  reports:        <AdminReports />,
  inquiry:        <AdminInquiry />,
  olletrails:     <AdminOlleTrails />,
};

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, handleLogout } = useContext(AuthContext) || {};
  const [active,      setActive]      = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);   // 데스크톱 기본 열림

  useEffect(() => {
    if (!user || user.memberRole !== 'A') {
      navigate('/error/403', { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.memberRole !== 'A') return null;

  const avatar = user.memberProfileImg
    ? <img src={user.memberProfileImg} alt="" loading="lazy" className="w-8 h-8 rounded-full object-cover" />
    : (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
        {(user.memberNickname || 'A')[0]}
      </div>
    );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-pretendard">

      {/* ════════════════════════════════
          사이드바
      ════════════════════════════════ */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex-shrink-0 h-full bg-slate-900 overflow-hidden flex flex-col z-30"
          >
            {/* 로고 */}
            <div className="px-6 py-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-black text-sm leading-none font-gmarket">HONDI</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">Admin Console</p>
                </div>
              </div>
            </div>

            {/* 메뉴 */}
            <nav className="admin-nav flex-1 overflow-y-auto py-4 px-3 space-y-5">
              {MENU_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 mb-1">
                    {group.label}
                  </p>
                  <ul className="space-y-0.5">
                    {group.items.map(({ key, label, icon: Icon }) => {
                      const isActive = active === key;
                      return (
                        <li key={key}>
                          <button
                            onClick={() => setActive(key)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                              isActive
                                ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            <span className="truncate">{label}</span>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-cyan-400" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            {/* 하단 — 유저 정보 + 로그아웃 */}
            <div className="px-4 py-4">
              <div className="flex items-center gap-2.5 mb-3">
                {avatar}
                <div className="min-w-0">
                  <p className="text-slate-200 text-sm font-semibold truncate">{user.memberNickname}</p>
                  <p className="text-slate-500 text-[11px] truncate">{user.memberEmail}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800 text-sm font-medium transition-all mb-1"
              >
                <Home className="w-4 h-4" />
                홈으로 이동
              </button>
              <button
                onClick={() => handleLogout?.()}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════
          메인 영역
      ════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* 탑바 */}
        <header className="flex-shrink-0 h-14 bg-white border-b border-slate-100 flex items-center px-5 gap-4 shadow-sm z-20">
          {/* 사이드바 토글 */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* 브레드크럼 */}
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-slate-400">관리자</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold text-slate-700">{PAGE_LABEL[active]}</span>
          </div>

          {/* 우측 — 관리자 뱃지 */}
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-100 rounded-full text-xs font-bold text-cyan-600">
              <Shield className="w-3 h-3" />
              관리자
            </span>
            {avatar}
          </div>
        </header>

        {/* 콘텐츠 */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* 페이지 타이틀 */}
            <div className="mb-6">
              <h1 className="text-xl font-black text-slate-800 font-gmarket">
                {PAGE_LABEL[active]}
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">HONDI 플랫폼을 관리하고 모니터링하세요</p>
            </div>

            {/* 패널 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {PANEL[active]}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
