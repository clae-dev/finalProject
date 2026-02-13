import React from 'react';
import { motion } from 'framer-motion';
import { UserCog, KeyRound, LogOut, ChevronRight } from 'lucide-react';

const actions = [
  {
    label: '프로필 수정',
    description: '닉네임, 프로필 사진 변경',
    icon: UserCog,
    gradient: 'from-sky-400 to-cyan-400',
    shadow: 'shadow-sky-200/50',
    onClick: () => alert('프로필 수정 기능은 준비 중입니다.'),
  },
  {
    label: '비밀번호 변경',
    description: '비밀번호를 안전하게 변경',
    icon: KeyRound,
    gradient: 'from-violet-400 to-purple-400',
    shadow: 'shadow-violet-200/50',
    onClick: () => alert('비밀번호 변경 기능은 준비 중입니다.'),
  },
  {
    label: '회원 탈퇴',
    description: '계정 및 데이터 삭제',
    icon: LogOut,
    gradient: 'from-rose-400 to-pink-400',
    shadow: 'shadow-rose-200/50',
    onClick: () => alert('회원 탈퇴 기능은 준비 중입니다.'),
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function QuickActions() {
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
          <h2
            className="text-2xl sm:text-3xl font-bold text-slate-800"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            계정 관리
          </h2>
          <p className="text-slate-500 mt-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            프로필과 계정 설정을 관리하세요
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                variants={cardVariants}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
                onClick={action.onClick}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg shadow-sky-100 border border-sky-50
                           hover:shadow-xl transition-shadow text-left group w-full"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mb-4
                              shadow-lg ${action.shadow} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3
                  className="font-bold text-slate-700 mb-1 flex items-center gap-1"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  {action.label}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-sm text-slate-400" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  {action.description}
                </p>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
