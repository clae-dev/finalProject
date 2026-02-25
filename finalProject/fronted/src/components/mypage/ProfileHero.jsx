import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Pencil } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function ProfileHero({ user, memberData, onEditProfile }) {
  const avatarUrl =
    memberData?.memberProfileImg || user.memberProfileImg ||
    `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(
      user.memberNickname || 'user'
    )}&backgroundColor=0ea5e9,06b6d4&shapeColor=ffffff`;

  const joinDate = memberData?.createdAt
    ? new Date(memberData.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-500" />

      {/* Decorative blurred circles */}
      <div className="absolute top-10 left-10 w-56 h-56 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-16 right-16 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-cyan-300/20 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative pt-32 pb-24 px-5">
        <motion.div
          className="max-w-4xl mx-auto flex flex-col items-center text-center"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="mb-6 relative group cursor-pointer"
            onClick={onEditProfile}
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-white/40 shadow-2xl shadow-sky-900/30 overflow-hidden bg-white">
              <img
                src={avatarUrl}
                alt={user.memberNickname}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full shadow-lg shadow-sky-900/20 flex items-center justify-center border-2 border-sky-300 hover:bg-sky-50 hover:scale-110 active:scale-95 transition-all duration-200"
              title="프로필 수정"
            >
              <Pencil className="w-4 h-4 text-sky-500" />
            </button>
          </motion.div>

          {/* Nickname */}
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg mb-2"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            {user.memberNickname}
          </motion.h1>

          {/* 자기소개 */}
          {memberData?.memberIntro && (
            <motion.p variants={fadeInUp} className="text-white/80 text-sm max-w-md mb-2">
              {memberData.memberIntro}
            </motion.p>
          )}

          {/* Email & 가입일 */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4 mt-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white/90 font-medium">
              <Mail className="w-4 h-4" />
              {user.memberEmail}
            </span>
            {joinDate && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white/90 font-medium">
                <Calendar className="w-4 h-4" />
                {joinDate} 가입
              </span>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 sm:h-20"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            fill="#f0f9ff"
            d="M0,30 C200,60 400,0 600,30 C800,60 1000,10 1200,40 C1350,60 1440,30 1440,30 L1440,80 L0,80 Z"
          />
        </svg>
      </div>
    </section>
  );
}
