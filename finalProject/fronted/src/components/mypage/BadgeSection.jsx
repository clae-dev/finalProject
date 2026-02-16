import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Compass,
  PenLine,
  MessageCircleHeart,
  ThumbsUp,
  UsersRound,
  ShieldCheck,
  Trophy,
} from 'lucide-react';

/**
 * 배지 정의
 * - check: memberData 기반 획득 여부 판별 함수
 * - goal: 목표 수치 (프로그레스 바 표시용)
 * - current: memberData에서 현재 수치를 꺼내는 함수
 */
const badgeDefs = [
  {
    key: 'newcomer',
    label: '신규 혼행러',
    icon: Compass,
    gradient: 'from-sky-400 to-cyan-400',
    shadow: 'shadow-sky-300/40',
    condition: '회원가입 완료',
    check: () => true,
    goal: 1,
    current: () => 1,
  },
  {
    key: 'explorer',
    label: '제주 탐험가',
    icon: PenLine,
    gradient: 'from-emerald-400 to-teal-400',
    shadow: 'shadow-emerald-300/40',
    condition: '게시글 5개 작성',
    check: (d) => (d?.postCount || 0) >= 5,
    goal: 5,
    current: (d) => d?.postCount || 0,
  },
  {
    key: 'communicator',
    label: '소통왕',
    icon: MessageCircleHeart,
    gradient: 'from-amber-400 to-orange-400',
    shadow: 'shadow-amber-300/40',
    condition: '후기 10개 작성',
    check: (d) => (d?.reviewCount || 0) >= 10,
    goal: 10,
    current: (d) => d?.reviewCount || 0,
  },
  {
    key: 'popular',
    label: '인기스타',
    icon: ThumbsUp,
    gradient: 'from-rose-400 to-pink-400',
    shadow: 'shadow-rose-300/40',
    condition: '좋아요 50개 달성',
    check: (d) => (d?.likeCount || 0) >= 50,
    goal: 50,
    current: (d) => d?.likeCount || 0,
  },
  {
    key: 'companion',
    label: '동행 마스터',
    icon: UsersRound,
    gradient: 'from-violet-400 to-purple-400',
    shadow: 'shadow-violet-300/40',
    condition: '동행 참여 5회',
    check: (d) => (d?.companionCount || 0) >= 5,
    goal: 5,
    current: (d) => d?.companionCount || 0,
  },
  {
    key: 'verified',
    label: '인증 리뷰어',
    icon: ShieldCheck,
    gradient: 'from-teal-400 to-emerald-500',
    shadow: 'shadow-teal-300/40',
    condition: '리뷰어 인증 완료',
    check: (d) => d?.verifiedReviewer === 'Y',
    goal: 1,
    current: (d) => (d?.verifiedReviewer === 'Y' ? 1 : 0),
  },
  {
    key: 'master',
    label: '제주 통달자',
    icon: Trophy,
    gradient: 'from-yellow-400 to-amber-500',
    shadow: 'shadow-yellow-300/40',
    condition: '모든 배지 획득',
    check: (d) => {
      return (
        (d?.postCount || 0) >= 5 &&
        (d?.reviewCount || 0) >= 10 &&
        (d?.likeCount || 0) >= 50 &&
        (d?.companionCount || 0) >= 5 &&
        d?.verifiedReviewer === 'Y'
      );
    },
    goal: 6,
    current: (d) => {
      let count = 1; // 신규 혼행러는 항상 달성
      if ((d?.postCount || 0) >= 5) count++;
      if ((d?.reviewCount || 0) >= 10) count++;
      if ((d?.likeCount || 0) >= 50) count++;
      if ((d?.companionCount || 0) >= 5) count++;
      if (d?.verifiedReviewer === 'Y') count++;
      return count;
    },
  },
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

export default function BadgeSection({ memberData }) {
  const earnedCount = badgeDefs.filter((b) => b.check(memberData)).length;

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
            <span
              className="ml-auto text-sm font-semibold text-slate-400"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              {earnedCount} / {badgeDefs.length}
            </span>
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
            {badgeDefs.map((badge) => {
              const earned = badge.check(memberData);
              const Icon = badge.icon;
              const current = Math.min(badge.current(memberData), badge.goal);
              const progress = Math.round((current / badge.goal) * 100);

              return (
                <motion.div
                  key={badge.key}
                  variants={badgeVariants}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  className={`relative rounded-2xl p-5 text-center transition-all cursor-default ${
                    earned
                      ? `bg-gradient-to-br ${badge.gradient} shadow-lg ${badge.shadow}`
                      : 'bg-slate-50 border-2 border-dashed border-slate-200'
                  }`}
                >
                  {/* 아이콘 */}
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                      earned ? 'bg-white/25' : 'bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${earned ? 'text-white' : 'text-slate-300'}`} />
                  </div>

                  <h4
                    className={`text-sm font-bold mb-1 ${earned ? 'text-white' : 'text-slate-400'}`}
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    {badge.label}
                  </h4>
                  <p className={`text-xs mb-3 ${earned ? 'text-white/80' : 'text-slate-300'}`}>
                    {badge.condition}
                  </p>

                  {/* 프로그레스 바 */}
                  {!earned && (
                    <div className="mt-auto">
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">
                        {current} / {badge.goal}
                      </p>
                    </div>
                  )}

                  {/* 획득 체크 */}
                  {earned && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  {/* 미획득 잠금 오버레이 제거 — 프로그레스 바가 대신 보이도록 */}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
