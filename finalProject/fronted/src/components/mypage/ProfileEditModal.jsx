import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Check, Loader2 } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { useUpdateMember } from '../../api/useMember';
import { checkNickname } from '../../api/memberAPI';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

export default function ProfileEditModal({ isOpen, onClose, memberData }) {
  const { user, setUser } = useContext(AuthContext);
  const updateMember = useUpdateMember();

  const [form, setForm] = useState({
    memberNickname: '',
    memberPhone: '',
    memberIntroduce: '',
    memberProfileImg: '',
  });
  const [nicknameStatus, setNicknameStatus] = useState(null); // null | 'checking' | 'available' | 'duplicate'
  const [originalNickname, setOriginalNickname] = useState('');

  useEffect(() => {
    if (memberData) {
      setForm({
        memberNickname: memberData.memberNickname || '',
        memberPhone: memberData.memberPhone || '',
        memberIntroduce: memberData.memberIntroduce || '',
        memberProfileImg: memberData.memberProfileImg || '',
      });
      setOriginalNickname(memberData.memberNickname || '');
      setNicknameStatus(null);
    }
  }, [memberData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'memberNickname') {
      setNicknameStatus(null);
    }
  };

  const handleCheckNickname = async () => {
    const nickname = form.memberNickname.trim();
    if (!nickname) return;
    if (nickname === originalNickname) {
      setNicknameStatus('available');
      return;
    }
    setNicknameStatus('checking');
    try {
      const result = await checkNickname(nickname);
      setNicknameStatus(result.data ? 'duplicate' : 'available');
    } catch {
      setNicknameStatus(null);
      alert('닉네임 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nickname = form.memberNickname.trim();
    if (!nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (nickname !== originalNickname && nicknameStatus !== 'available') {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }

    try {
      await updateMember.mutateAsync({
        memberNo: user.memberNo,
        data: {
          memberNickname: nickname,
          memberPhone: form.memberPhone.trim(),
          memberIntroduce: form.memberIntroduce.trim(),
          memberProfileImg: form.memberProfileImg.trim(),
        },
      });

      // AuthContext user 상태 + localStorage 갱신
      const updatedUser = {
        ...user,
        memberNickname: nickname,
        memberProfileImg: form.memberProfileImg.trim() || user.memberProfileImg,
      };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));

      alert('프로필이 수정되었습니다.');
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || '프로필 수정 중 오류가 발생했습니다.');
    }
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
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
                프로필 수정
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 프로필 이미지 URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  <Camera className="w-4 h-4 inline mr-1" />
                  프로필 이미지 URL
                </label>
                <input
                  type="url"
                  name="memberProfileImg"
                  value={form.memberProfileImg}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all text-sm"
                />
              </div>

              {/* 닉네임 */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  닉네임
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="memberNickname"
                    value={form.memberNickname}
                    onChange={handleChange}
                    maxLength={20}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleCheckNickname}
                    disabled={nicknameStatus === 'checking'}
                    className="px-4 py-3 bg-sky-500 text-white rounded-xl text-sm font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {nicknameStatus === 'checking' ? <Loader2 className="w-4 h-4 animate-spin" /> : '중복확인'}
                  </button>
                </div>
                {nicknameStatus === 'available' && (
                  <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> 사용 가능한 닉네임입니다.
                  </p>
                )}
                {nicknameStatus === 'duplicate' && (
                  <p className="text-xs text-rose-500 mt-1">이미 사용 중인 닉네임입니다.</p>
                )}
              </div>

              {/* 전화번호 */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  전화번호
                </label>
                <input
                  type="tel"
                  name="memberPhone"
                  value={form.memberPhone}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all text-sm"
                />
              </div>

              {/* 자기소개 */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  자기소개
                </label>
                <textarea
                  name="memberIntroduce"
                  value={form.memberIntroduce}
                  onChange={handleChange}
                  rows={3}
                  maxLength={200}
                  placeholder="자기소개를 입력해주세요"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all text-sm resize-none"
                />
                <p className="text-xs text-slate-400 text-right mt-1">{form.memberIntroduce.length}/200</p>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-500 font-semibold hover:bg-slate-50 transition-colors text-sm"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={updateMember.isPending}
                  className="flex-1 py-3 bg-gradient-to-r from-sky-400 to-cyan-400 text-white rounded-xl font-semibold hover:from-sky-500 hover:to-cyan-500 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {updateMember.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  저장
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
