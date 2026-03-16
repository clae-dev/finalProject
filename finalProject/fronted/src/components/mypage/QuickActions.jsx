import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCog, KeyRound, LogOut, ChevronRight } from 'lucide-react';
import ProfileEditModal from './ProfileEditModal';
import PasswordChangeModal from './PasswordChangeModal';
import WithdrawModal from './WithdrawModal';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const actionDefs = [
  {
    key: 'profile',
    label: '프로필 수정',
    description: '닉네임, 프로필 사진 변경',
    icon: UserCog,
    gradient: 'from-sky-400 to-cyan-400',
    shadow: 'shadow-sky-200/50',
  },
  {
    key: 'password',
    label: '비밀번호 변경',
    description: '비밀번호를 안전하게 변경',
    icon: KeyRound,
    gradient: 'from-violet-400 to-purple-400',
    shadow: 'shadow-violet-200/50',
  },
  {
    key: 'withdraw',
    label: '회원 탈퇴',
    description: '계정 및 데이터 삭제',
    icon: LogOut,
    gradient: 'from-rose-400 to-pink-400',
    shadow: 'shadow-rose-200/50',
  },
];

export default function QuickActions({ memberData, memberNo }) {
  const [openModal, setOpenModal] = useState(null);

  return (
    <>
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
              className="text-2xl sm:text-3xl font-bold text-slate-800 font-gmarket"
            >
              계정 관리
            </h2>
            <p className="text-slate-500 mt-2 font-pretendard">
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
            {actionDefs.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.key}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setOpenModal(action.key)}
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
                    className="font-bold text-slate-700 mb-1 flex items-center gap-1 font-pretendard"
                  >
                    {action.label}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-sm text-slate-400 font-pretendard">
                    {action.description}
                  </p>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <ProfileEditModal
        isOpen={openModal === 'profile'}
        onClose={() => setOpenModal(null)}
        memberData={memberData}
      />
      <PasswordChangeModal
        isOpen={openModal === 'password'}
        onClose={() => setOpenModal(null)}
        memberNo={memberNo}
      />
      <WithdrawModal
        isOpen={openModal === 'withdraw'}
        onClose={() => setOpenModal(null)}
        memberNo={memberNo}
      />
    </>
  );
}
