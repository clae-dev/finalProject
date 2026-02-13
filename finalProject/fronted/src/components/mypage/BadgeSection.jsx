import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

const badges = [
  { label: '신규 혼행러', emoji: '🌊', gradient: 'from-sky-400 to-cyan-400', condition: '회원가입 완료', earned: true },
  { label: '제주 탐험가', emoji: '✨', gradient: 'from-emerald-400 to-teal-400', condition: '게시글 5개 작성', earned: true },
  { label: '소통왕', emoji: '💬', gradient: 'from-amber-400 to-orange-400', condition: '후기 10개 작성', earned: false },
  { label: '인기스타', emoji: '❤️', gradient: 'from-rose-400 to-pink-400', condition: '좋아요 50개 달성', earned: false },
  { label: '동행 마스터', emoji: '🤝', gradient: 'from-violet-400 to-purple-400', condition: '동행 참여 5회', earned: false },
  { label: '제주 통달자', emoji: '🏆', gradient: 'from-yellow-400 to-amber-500', condition: '모든 카테고리 활동', earned: false },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 300, damping: 15 },
  },
};

export default function BadgeSection() {
  return (
    <section className="py-12 px-5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200/50">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-slate-800"
              style={{ fontFamily: "'GmarketSans', sans-serif" }}
            >
              활동 배지
            </h2>
          </div>
          <p className="text-slate-500 mt-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            활동을 통해 특별한 배지를 모아보세요
          </p>
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-lg shadow-sky-100 border border-sky-50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {badges.map((badge) => (
              <motion.div
                key={badge.label}
                variants={badgeVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className={`relative rounded-2xl p-4 text-center transition-all cursor-default ${
                  badge.earned
                    ? 'bg-gradient-to-br ' + badge.gradient + ' shadow-lg'
                    : 'bg-slate-50 border-2 border-dashed border-slate-200'
                }`}
              >
                <div className="text-3xl mb-2">{badge.emoji}</div>
                <h4
                  className={`text-sm font-bold mb-1 ${badge.earned ? 'text-white' : 'text-slate-400'}`}
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  {badge.label}
                </h4>
                <p className={`text-xs ${badge.earned ? 'text-white/80' : 'text-slate-300'}`}>
                  {badge.condition}
                </p>
                {!badge.earned && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-2xl backdrop-blur-[1px]">
                    <span className="text-2xl">🔒</span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
