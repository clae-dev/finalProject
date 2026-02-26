import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useResetPassword } from '../../api/member/useMember';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

export default function PasswordChangeModal({ isOpen, onClose, memberNo }) {
  const resetPassword = useResetPassword();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    if (!password) return '';
    if (password.length < 8 || password.length > 20) return '비밀번호는 8~20자여야 합니다.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return '특수문자를 포함해야 합니다.';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      const pwError = validatePassword(value);
      setErrors((prev) => ({ ...prev, newPassword: value ? pwError : '' }));
      if (form.confirmPassword && value !== form.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }));
      } else if (form.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    } else if (name === 'confirmPassword') {
      if (value && form.newPassword !== value) {
        setErrors((prev) => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const toggleShow = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    if (form.newPassword.length < 8 || form.newPassword.length > 20) {
      alert('새 비밀번호는 8~20자여야 합니다.');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword)) {
      alert('새 비밀번호에 특수문자를 포함해야 합니다.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await resetPassword.mutateAsync({
        memberNo,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert('비밀번호가 변경되었습니다.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
                비밀번호 변경
              </h2>
              <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 현재 비밀번호 */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  현재 비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 새 비밀번호 */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  새 비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-rose-500 mt-1">{errors.newPassword}</p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword}</p>
                )}
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
                  disabled={resetPassword.isPending}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-400 to-purple-400 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {resetPassword.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  변경하기
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
