import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { useWithdrawMember } from '../../api/member/useMember';
import { clearAllAuth } from '../../api/core/tokenStorage';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

export default function WithdrawModal({ isOpen, onClose, memberNo }) {
  const withdrawMember = useWithdrawMember();
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (!window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      await withdrawMember.mutateAsync({ memberNo, memberPw: password });

      alert('회원 탈퇴가 완료되었습니다.');

      // 로그아웃 처리: 양쪽 Storage 정리 + 홈 이동
      clearAllAuth();
      window.location.href = '/';
    } catch (error) {
      alert(error.response?.data?.message || '회원 탈퇴 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 font-gmarket">
                회원 탈퇴
              </h2>
              <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* 경고 */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-rose-700 mb-1 font-pretendard">
                    탈퇴 시 아래 정보가 모두 삭제됩니다
                  </p>
                  <ul className="text-xs text-rose-600 space-y-1 font-pretendard">
                    <li>- 작성한 게시글 및 댓글</li>
                    <li>- 후기 및 스크랩 데이터</li>
                    <li>- 프로필 정보 및 활동 내역</li>
                  </ul>
                  <p className="text-xs text-rose-500 mt-2 font-semibold">
                    이 작업은 되돌릴 수 없습니다.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 비밀번호 확인 */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2 font-pretendard">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all text-sm"
                />
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-500 font-semibold hover:bg-slate-50 transition-colors text-sm"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={withdrawMember.isPending}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-xl font-semibold hover:from-rose-500 hover:to-pink-500 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {withdrawMember.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  탈퇴하기
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
