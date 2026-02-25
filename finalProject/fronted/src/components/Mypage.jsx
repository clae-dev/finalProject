/**
 * 마이페이지 컴포넌트 - 프로필, 활동 통계, 배지, 인증, 프로필 수정 모달
 */
import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from './AuthContext';
import { useMember } from '../api/member/useMember';
import Header from './common/Header';
import Footer from './main/Footer';
import ProfileHero from './mypage/ProfileHero';
import StatsGrid from './mypage/StatsGrid';
import ActivityTabs from './mypage/ActivityTabs';
import QuickActions from './mypage/QuickActions';
import BadgeSection from './mypage/BadgeSection';
import ProfileEditModal from './mypage/ProfileEditModal';

export default function MyPage() {
  const { user } = useContext(AuthContext);
  const { data: memberResponse, isLoading, isError } = useMember(user?.memberNo);
  const memberData = memberResponse?.data;
  const [profileEditOpen, setProfileEditOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500" style={{ fontFamily: "'Pretendard', sans-serif" }}>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 text-lg" style={{ fontFamily: "'Pretendard', sans-serif" }}>회원 정보를 불러오는데 실패했습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors text-sm font-semibold"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-sky-50 to-cyan-50 overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <ProfileHero user={user} memberData={memberData} onEditProfile={() => setProfileEditOpen(true)} />
      <StatsGrid memberData={memberData} />
      <ActivityTabs />
      <BadgeSection memberData={memberData} />
      <QuickActions memberData={memberData} memberNo={user.memberNo} />
      <Footer />
      <ProfileEditModal
        isOpen={profileEditOpen}
        onClose={() => setProfileEditOpen(false)}
        memberData={memberData}
      />
    </motion.div>
  );
}
