import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldCheck, LayoutDashboard, Users, FileText, Building2, MapPin, MessageCircleQuestion, Megaphone, Flag } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import AdminDashboard from '../../components/admin/AdminDashboard';
import AdminMembers from '../../components/admin/AdminMembers';
import AdminPosts from '../../components/admin/AdminPosts';
import AdminAccommodations from '../../components/admin/AdminAccommodations';
import AdminSpots from '../../components/admin/AdminSpots';
import AdminFaq from '../../components/admin/AdminFaq';
import AdminNotices from '../../components/admin/AdminNotices';
import AdminReports from '../../components/admin/AdminReports';
import AdminVerifications from '../../components/admin/AdminVerifications';
import { AuthContext } from '../../components/AuthContext';

const TABS = [
  { key: 'dashboard', label: '대시보드', icon: LayoutDashboard },
  { key: 'members', label: '회원 관리', icon: Users },
  { key: 'posts', label: '게시물 관리', icon: FileText },
  { key: 'accommodations', label: '숙소 관리', icon: Building2 },
  { key: 'spots', label: '명소 관리', icon: MapPin },
  { key: 'faq', label: 'FAQ 관리', icon: MessageCircleQuestion },
  { key: 'notices', label: '공지 관리', icon: Megaphone },
  { key: 'verifications', label: '인증 관리', icon: ShieldCheck },
  { key: 'reports', label: '신고 관리', icon: Flag },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!user || user.memberRole !== 'A') {
      navigate('/error/403', { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.memberRole !== 'A') return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      {/* 히어로 배너 */}
      <div className="relative h-[320px] overflow-hidden bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600">
        {/* 장식 */}
        <motion.div
          className="absolute top-10 left-[10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 right-[10%] w-48 h-48 bg-cyan-300/10 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-cyan-100 shadow-lg"
          >
            <Shield className="w-4 h-4 text-cyan-300" />
            <span style={{ fontFamily: "'Pretendard', sans-serif" }}>Admin Panel</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl md:text-5xl font-black mb-4 text-center leading-tight drop-shadow-lg"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            <span className="text-white">관리자 </span>
            <span className="bg-gradient-to-r from-cyan-200 via-sky-200 to-teal-200 bg-clip-text text-transparent">대시보드</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-white/70 text-center"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            HONDI 플랫폼을 관리하고 모니터링하세요
          </motion.p>
        </div>

        {/* 하단 웨이브 */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(240 249 255)" d="M0,50 C300,80 600,20 900,50 C1100,70 1300,30 1440,45 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="max-w-6xl mx-auto px-5 -mt-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-sky-100 border border-sky-50 p-2 flex justify-center gap-2 overflow-x-auto"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200/60'
                    : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50'
                }`}
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="max-w-6xl mx-auto px-5 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'members' && <AdminMembers />}
            {activeTab === 'posts' && <AdminPosts />}
            {activeTab === 'accommodations' && <AdminAccommodations />}
            {activeTab === 'spots' && <AdminSpots />}
            {activeTab === 'faq' && <AdminFaq />}
            {activeTab === 'notices' && <AdminNotices />}
            {activeTab === 'verifications' && <AdminVerifications />}
            {activeTab === 'reports' && <AdminReports />}
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
