import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Compass,
  PenLine,
  MessageCircleHeart,
  ThumbsUp,
  UsersRound,
  Trophy,
} from 'lucide-react';

const badgeDefs = [
  {
    key: 'newcomer',
    label: '신규 혼행러',
    icon: Compass,
    emoji: '🐣',
    bg: 'bg-sky-100',
    ring: 'ring-sky-300',
    iconColor: 'text-sky-500',
    earnedBg: 'bg-gradient-to-br from-sky-400 to-cyan-400',
    shadow: 'shadow-sky-200/60',
    condition: '회원가입 완료',
    check: () => true,
    goal: 1,
    current: () => 1,
  },
  {
    key: 'explorer',
    label: '제주 탐험가',
    icon: PenLine,
    emoji: '🗺️',
    bg: 'bg-emerald-100',
    ring: 'ring-emerald-300',
    iconColor: 'text-emerald-500',
    earnedBg: 'bg-gradient-to-br from-emerald-400 to-teal-400',
    shadow: 'shadow-emerald-200/60',
    condition: '게시글 5개 작성',
    check: (d) => (d?.postCount || 0) >= 5,
    goal: 5,
    current: (d) => d?.postCount || 0,
  },
  {
    key: 'communicator',
    label: '소통왕',
    icon: MessageCircleHeart,
    emoji: '💬',
    bg: 'bg-amber-100',
    ring: 'ring-amber-300',
    iconColor: 'text-amber-500',
    earnedBg: 'bg-gradient-to-br from-amber-400 to-orange-400',
    shadow: 'shadow-amber-200/60',
    condition: '후기 10개 작성',
    check: (d) => (d?.reviewCount || 0) >= 10,
    goal: 10,
    current: (d) => d?.reviewCount || 0,
  },
  {
    key: 'popular',
    label: '인기스타',
    icon: ThumbsUp,
    emoji: '⭐',
    bg: 'bg-rose-100',
    ring: 'ring-rose-300',
    iconColor: 'text-rose-500',
    earnedBg: 'bg-gradient-to-br from-rose-400 to-pink-400',
    shadow: 'shadow-rose-200/60',
    condition: '좋아요 50개 달성',
    check: (d) => (d?.likeCount || 0) >= 50,
    goal: 50,
    current: (d) => d?.likeCount || 0,
  },
  {
    key: 'companion',
    label: '동행 마스터',
    icon: UsersRound,
    emoji: '🤝',
    bg: 'bg-violet-100',
    ring: 'ring-violet-300',
    iconColor: 'text-violet-500',
    earnedBg: 'bg-gradient-to-br from-violet-400 to-purple-400',
    shadow: 'shadow-violet-200/60',
    condition: '동행 참여 5회',
    check: (d) => (d?.companionCount || 0) >= 5,
    goal: 5,
    current: (d) => d?.companionCount || 0,
  },
  {
    key: 'reviewer',
    label: '리뷰평론가',
    icon: Award,
    emoji: '📝',
    bg: 'bg-teal-100',
    ring: 'ring-teal-300',
    iconColor: 'text-teal-500',
    earnedBg: 'bg-gradient-to-br from-teal-400 to-emerald-500',
    shadow: 'shadow-teal-200/60',
    condition: '숙소 리뷰 10개 작성',
    check: (d) => (d?.accommReviewCount || 0) >= 10,
    goal: 10,
    current: (d) => d?.accommReviewCount || 0,
  },
  {
    key: 'master',
    label: '제주 통달자',
    icon: Trophy,
    emoji: '🏆',
    bg: 'bg-yellow-100',
    ring: 'ring-yellow-400',
    iconColor: 'text-yellow-500',
    earnedBg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
    shadow: 'shadow-yellow-200/60',
    condition: '모든 배지 획득',
    check: (d) => {
      return (
        (d?.postCount || 0) >= 5 &&
        (d?.reviewCount || 0) >= 10 &&
        (d?.likeCount || 0) >= 50 &&
        (d?.companionCount || 0) >= 5 &&
        (d?.accommReviewCount || 0) >= 10
      );
    },
    goal: 6,
    current: (d) => {
      let count = 1;
      if ((d?.postCount || 0) >= 5) count++;
      if ((d?.reviewCount || 0) >= 10) count++;
      if ((d?.likeCount || 0) >= 50) count++;
      if ((d?.companionCount || 0) >= 5) count++;
      if ((d?.accommReviewCount || 0) >= 10) count++;
      return count;
    },
  },
];

export default function BadgeSection({ memberData }) {
  const earnedCount = badgeDefs.filter((b) => b.check(memberData)).length;

  return (
    <section className="py-10 px-5">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎖️</span>
            <h2
              className="text-xl font-extrabold text-slate-800 font-pretendard"
            >
              나의 배지 컬렉션
            </h2>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-full font-pretendard"
          >
            <span className="text-sm">✨</span>
            <span className="text-xs font-bold text-amber-600">
              {earnedCount}개 획득
            </span>
          </div>
        </motion.div>

        {/* 획득 배지 가로 스크롤 */}
        {earnedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
              {badgeDefs.filter((b) => b.check(memberData)).map((badge, i) => (
                <motion.div
                  key={badge.key}
                  initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 250, damping: 15 }}
                  whileHover={{ scale: 1.08, y: -4 }}
                  className={`flex-shrink-0 ${badge.earnedBg} rounded-2xl px-5 py-4 shadow-lg ${badge.shadow} cursor-default min-w-[140px]`}
                >
                  <div className="text-center">
                    <span className="text-3xl block mb-2">{badge.emoji}</span>
                    <p
                      className="text-[13px] font-bold text-white leading-tight font-pretendard"
                    >
                      {badge.label}
                    </p>
                    <p
                      className="text-[10px] text-white/70 mt-0.5 font-pretendard"
                    >
                      {badge.condition}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          </motion.div>
        )}

        {/* 전체 배지 그리드 */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {badgeDefs.map((badge) => {
            const earned = badge.check(memberData);
            const Icon = badge.icon;
            const current = Math.min(badge.current(memberData), badge.goal);
            const pct = Math.round((current / badge.goal) * 100);

            return (
              <motion.div
                key={badge.key}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 18 } },
                }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`relative rounded-2xl p-4 transition-all cursor-default ${
                  earned
                    ? 'bg-white shadow-md ring-1 ring-slate-100'
                    : 'bg-slate-50/70 ring-1 ring-slate-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* 아이콘 영역 */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      earned
                        ? `${badge.bg} ring-2 ${badge.ring}`
                        : 'bg-slate-100'
                    }`}
                  >
                    {earned ? (
                      <span className="text-lg">{badge.emoji}</span>
                    ) : (
                      <Icon className="w-5 h-5 text-slate-300" />
                    )}
                  </div>

                  {/* 텍스트 */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-[13px] font-bold leading-tight ${
                        earned ? 'text-slate-700' : 'text-slate-400'
                      }`}
                      className="font-pretendard"
                    >
                      {badge.label}
                    </h4>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        earned ? 'text-slate-400' : 'text-slate-300'
                      }`}
                      className="font-pretendard"
                    >
                      {badge.condition}
                    </p>
                  </div>
                </div>

                {/* 프로그레스 */}
                {!earned && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden mr-2">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${badge.earnedBg}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                        />
                      </div>
                      <span
                        className="text-[10px] font-bold text-slate-400 tabular-nums flex-shrink-0 font-pretendard"
                      >
                        {current}/{badge.goal}
                      </span>
                    </div>
                  </div>
                )}

                {/* 획득 표시 */}
                {earned && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center shadow-sm shadow-emerald-200/80">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
