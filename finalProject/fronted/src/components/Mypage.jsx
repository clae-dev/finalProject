import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from './AuthContext';
import Header from './common/Header';
import Footer from './main/Footer';
import ProfileHero from './mypage/ProfileHero';
import StatsGrid from './mypage/StatsGrid';
import ActivityTabs from './mypage/ActivityTabs';
import QuickActions from './mypage/QuickActions';
import BadgeSection from './mypage/BadgeSection';

export default function MyPage() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-sky-50 to-cyan-50 overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <ProfileHero user={user} />
      <StatsGrid />
      <ActivityTabs />
      <BadgeSection />
      <QuickActions />
      <Footer />
    </motion.div>
  );
}
