import React, { useState, useEffect, useContext, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, RefreshCw, RotateCcw, CheckCircle2, Upload, ImagePlus } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { useUpdateMember } from '../../api/member/useMember';
import { checkNickname, uploadProfileImage } from '../../api/member/memberAPI';
import { saveToken } from '../../api/core/tokenStorage';
import { compressImage } from '../../lib/imageUtils';

const AVATAR_STYLES = ['adventurer', 'fun-emoji', 'avataaars', 'bottts', 'pixel-art', 'lorelei'];

const generateAvatars = () => {
  return Array.from({ length: 12 }, () => {
    const style = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
    const seed = Math.random().toString(36).substring(2, 10);
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;
  });
};

const AVATAR_PARTS = {
  top: {
    label: '헤어',
    options: [
      { value: 'shortFlat', label: '숏컷' },
      { value: 'shortCurly', label: '짧은곱슬' },
      { value: 'shortRound', label: '숏라운드' },
      { value: 'shortWaved', label: '짧은웨이브' },
      { value: 'bob', label: '단발' },
      { value: 'bun', label: '묶은머리' },
      { value: 'curly', label: '곱슬' },
      { value: 'curvy', label: '웨이브' },
      { value: 'dreads', label: '드레드' },
      { value: 'dreads01', label: '드레드1' },
      { value: 'dreads02', label: '드레드2' },
      { value: 'frida', label: '프리다' },
      { value: 'fro', label: '아프로' },
      { value: 'froBand', label: '아프로밴드' },
      { value: 'frizzle', label: '곱슬곱슬' },
      { value: 'longButNotTooLong', label: '중간머리' },
      { value: 'miaWallace', label: '긴직모' },
      { value: 'shavedSides', label: '투블록' },
      { value: 'straight01', label: '직모1' },
      { value: 'straight02', label: '직모2' },
      { value: 'straightAndStrand', label: '가르마' },
      { value: 'shaggy', label: '텁수룩' },
      { value: 'shaggyMullet', label: '멀렛' },
      { value: 'sides', label: '옆머리' },
      { value: 'theCaesar', label: '시저컷' },
      { value: 'theCaesarAndSidePart', label: '시저가르마' },
      { value: 'bigHair', label: '풍성한머리' },
      { value: 'hat', label: '모자' },
      { value: 'hijab', label: '히잡' },
      { value: 'turban', label: '터번' },
      { value: 'winterHat1', label: '겨울모자1' },
      { value: 'winterHat02', label: '겨울모자2' },
      { value: 'winterHat03', label: '겨울모자3' },
      { value: 'winterHat04', label: '겨울모자4' },
    ]
  },
  eyes: {
    label: '눈',
    options: [
      { value: 'default', label: '기본' },
      { value: 'happy', label: '행복' },
      { value: 'closed', label: '감은눈' },
      { value: 'cry', label: '울음' },
      { value: 'eyeRoll', label: '째려보기' },
      { value: 'hearts', label: '하트' },
      { value: 'side', label: '옆보기' },
      { value: 'squint', label: '찡그린' },
      { value: 'surprised', label: '놀람' },
      { value: 'wink', label: '윙크' },
      { value: 'winkWacky', label: '장난윙크' },
      { value: 'xDizzy', label: '어지러움' },
    ]
  },
  eyebrows: {
    label: '눈썹',
    options: [
      { value: 'default', label: '기본' },
      { value: 'defaultNatural', label: '내추럴' },
      { value: 'angry', label: '화남' },
      { value: 'angryNatural', label: '화남내추럴' },
      { value: 'flatNatural', label: '평평한' },
      { value: 'frownNatural', label: '찌푸린' },
      { value: 'raisedExcited', label: '놀란' },
      { value: 'raisedExcitedNatural', label: '놀란내추럴' },
      { value: 'sadConcerned', label: '슬픈' },
      { value: 'sadConcernedNatural', label: '슬픈내추럴' },
      { value: 'unibrowNatural', label: '일자눈썹' },
      { value: 'upDown', label: '한쪽올린' },
      { value: 'upDownNatural', label: '한쪽내추럴' },
    ]
  },
  mouth: {
    label: '입',
    options: [
      { value: 'default', label: '기본' },
      { value: 'smile', label: '미소' },
      { value: 'twinkle', label: '씩웃음' },
      { value: 'concerned', label: '걱정' },
      { value: 'disbelief', label: '불신' },
      { value: 'eating', label: '먹기' },
      { value: 'grimace', label: '찡그림' },
      { value: 'sad', label: '슬픔' },
      { value: 'screamOpen', label: '비명' },
      { value: 'serious', label: '진지' },
      { value: 'tongue', label: '혀' },
      { value: 'vomit', label: '구역질' },
    ]
  },
  clothing: {
    label: '옷',
    options: [
      { value: 'hoodie', label: '후드티' },
      { value: 'blazerAndShirt', label: '정장셔츠' },
      { value: 'blazerAndSweater', label: '정장니트' },
      { value: 'collarAndSweater', label: '카라니트' },
      { value: 'graphicShirt', label: '그래픽티' },
      { value: 'overall', label: '오버올' },
      { value: 'shirtCrewNeck', label: '라운드넥' },
      { value: 'shirtScoopNeck', label: 'U넥' },
      { value: 'shirtVNeck', label: 'V넥' },
    ]
  },
  accessories: {
    label: '악세사리',
    options: [
      { value: '', label: '없음' },
      { value: 'kurt', label: '커트' },
      { value: 'prescription01', label: '안경1' },
      { value: 'prescription02', label: '안경2' },
      { value: 'round', label: '동글이' },
      { value: 'sunglasses', label: '선글라스' },
      { value: 'wayfarers', label: '웨이페어러' },
      { value: 'eyepatch', label: '안대' },
    ]
  },
  facialHair: {
    label: '수염',
    options: [
      { value: '', label: '없음' },
      { value: 'beardLight', label: '옅은수염' },
      { value: 'beardMajestic', label: '풍성한수염' },
      { value: 'beardMedium', label: '중간수염' },
      { value: 'moustacheFancy', label: '멋진콧수염' },
      { value: 'moustacheMagnum', label: '큰콧수염' },
    ]
  },
  skinColor: {
    label: '피부색',
    type: 'color',
    options: [
      { value: 'ffdbb4', color: '#ffdbb4' },
      { value: 'edb98a', color: '#edb98a' },
      { value: 'fd9841', color: '#fd9841' },
      { value: 'd08b5b', color: '#d08b5b' },
      { value: 'ae5d29', color: '#ae5d29' },
      { value: '614335', color: '#614335' },
      { value: 'f8d25c', color: '#f8d25c' },
    ]
  },
  hairColor: {
    label: '머리색',
    type: 'color',
    options: [
      { value: '2c1b18', color: '#2c1b18' },
      { value: '4a312c', color: '#4a312c' },
      { value: '724133', color: '#724133' },
      { value: 'a55728', color: '#a55728' },
      { value: 'b58143', color: '#b58143' },
      { value: 'd6b370', color: '#d6b370' },
      { value: 'ecdcbf', color: '#ecdcbf' },
      { value: 'c93305', color: '#c93305' },
      { value: 'f59797', color: '#f59797' },
      { value: 'e8e1e1', color: '#e8e1e1' },
    ]
  },
  clothColor: {
    label: '옷색깔',
    type: 'color',
    options: [
      { value: '262e33', color: '#262e33' },
      { value: '65c9ff', color: '#65c9ff' },
      { value: '5199e4', color: '#5199e4' },
      { value: '25557c', color: '#25557c' },
      { value: '929598', color: '#929598' },
      { value: 'e6e6e6', color: '#e6e6e6' },
      { value: 'ffffff', color: '#ffffff' },
      { value: 'ff488e', color: '#ff488e' },
      { value: 'ff5c5c', color: '#ff5c5c' },
      { value: 'ffafb9', color: '#ffafb9' },
      { value: 'ffdeb5', color: '#ffdeb5' },
      { value: 'ff8c00', color: '#ff8c00' },
      { value: 'a7ffc4', color: '#a7ffc4' },
      { value: '3c4f5c', color: '#3c4f5c' },
    ]
  },
};

const buildCustomAvatarUrl = (parts) => {
  const params = new URLSearchParams();
  Object.entries(parts).forEach(([key, value]) => {
    if (value) {
      if (key === 'clothColor') {
        params.set('clotheColor', value);
      } else {
        params.set(key, value);
      }
    }
  });
  if (parts.accessories) params.set('accessoriesProbability', '100');
  if (parts.facialHair) params.set('facialHairProbability', '100');
  return `https://api.dicebear.com/9.x/avataaars/svg?${params.toString()}`;
};

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
    memberIntro: '',
    memberProfileImg: '',
  });
  const [nicknameStatus, setNicknameStatus] = useState(null);
  const [originalNickname, setOriginalNickname] = useState('');

  // 아바타 관련 state
  const [avatarMode, setAvatarMode] = useState('random');
  const [avatars, setAvatars] = useState(() => generateAvatars());
  const [customParts, setCustomParts] = useState({
    top: 'shortFlat',
    eyes: 'default',
    eyebrows: 'default',
    mouth: 'default',
    clothing: 'hoodie',
    accessories: '',
    facialHair: '',
    skinColor: 'ffdbb4',
    hairColor: '2c1b18',
    clothColor: '65c9ff',
  });
  const [activeCategory, setActiveCategory] = useState('top');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const customAvatarUrl = useMemo(() => buildCustomAvatarUrl(customParts), [customParts]);

  useEffect(() => {
    if (memberData) {
      setForm({
        memberNickname: memberData.memberNickname || '',
        memberPhone: memberData.memberPhone || '',
        memberIntro: memberData.memberIntro || '',
        memberProfileImg: memberData.memberProfileImg || '',
      });
      setOriginalNickname(memberData.memberNickname || '');
      setNicknameStatus(null);

      // OAuth 사용자의 기존 닉네임 중복 여부 자동 체크
      if (isOpen && memberData.memberNickname && user?.memberNo) {
        checkNickname(memberData.memberNickname, user.memberNo)
          .then((result) => {
            if (!result.success) {
              setNicknameStatus('duplicate');
            }
          })
          .catch(() => {});
      }
    }
  }, [memberData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'memberNickname') {
      setNicknameStatus(null);
    }
  };

  const refreshAvatars = useCallback(() => {
    setAvatars(generateAvatars());
  }, []);

  const switchAvatarMode = useCallback((mode) => {
    setAvatarMode(mode);
    if (mode === 'custom') {
      setForm(prev => ({ ...prev, memberProfileImg: buildCustomAvatarUrl(customParts) }));
    }
  }, [customParts]);

  const updateCustomPart = useCallback((category, value) => {
    setCustomParts(prev => ({ ...prev, [category]: value }));
  }, []);

  const selectAvatar = (url) => {
    setForm(prev => ({ ...prev, memberProfileImg: url }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하만 가능합니다.');
      return;
    }
    setUploading(true);
    try {
      const compressed = await compressImage(file, 400, 0.80);
      const result = await uploadProfileImage(compressed);
      if (result.success) {
        setForm(prev => ({ ...prev, memberProfileImg: result.imageUrl }));
      } else {
        alert(result.message || '업로드에 실패했습니다.');
      }
    } catch {
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCheckNickname = async () => {
    const nickname = form.memberNickname.trim();
    if (!nickname) return;
    setNicknameStatus('checking');
    try {
      const result = await checkNickname(nickname, user?.memberNo);
      setNicknameStatus(result.success ? 'available' : 'duplicate');
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
    if (nicknameStatus !== 'available') {
      alert(nicknameStatus === 'duplicate'
        ? '이미 사용 중인 닉네임입니다. 다른 닉네임으로 변경해주세요.'
        : '닉네임 중복 확인을 해주세요.');
      return;
    }

    // 커스텀 모드일 때 저장 시점에 URL 반영
    const profileImg = avatarMode === 'custom' ? customAvatarUrl : form.memberProfileImg.trim();

    try {
      const result = await updateMember.mutateAsync({
        memberNo: user.memberNo,
        data: {
          memberNickname: nickname,
          memberPhone: form.memberPhone.trim(),
          memberIntro: form.memberIntro.trim(),
          memberProfileImg: profileImg,
        },
      });

      if (!result.success) {
        alert(result.message || '프로필 수정에 실패했습니다.');
        return;
      }

      const updatedUser = {
        ...user,
        memberNickname: nickname,
        memberPhone: form.memberPhone.trim(),
        memberIntro: form.memberIntro.trim(),
        memberProfileImg: profileImg || user.memberProfileImg,
      };
      setUser(updatedUser);
      saveToken('userData', JSON.stringify(updatedUser));

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
              {/* 프로필 아바타 선택 */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  프로필 아바타
                </label>

                {/* 탭 전환 */}
                <div className="flex rounded-2xl bg-slate-100/80 p-1 mb-3">
                  {[
                    { key: 'random', label: '랜덤 선택' },
                    { key: 'custom', label: '직접 꾸미기' },
                    { key: 'upload', label: '이미지 업로드' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => switchAvatarMode(tab.key)}
                      className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-300 ${
                        avatarMode === tab.key
                          ? 'bg-white text-sky-600 shadow-sm shadow-sky-100'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 랜덤 선택 모드 */}
                {avatarMode === 'random' && (
                  <div>
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, memberProfileImg: '' }))}
                        className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-500 font-medium transition-colors bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        <RotateCcw className="w-3 h-3" />
                        초기화
                      </button>
                      <button
                        type="button"
                        onClick={refreshAvatars}
                        className="flex items-center gap-1.5 text-xs text-sky-500 hover:text-sky-600 font-medium transition-colors bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-full"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        <RefreshCw className="w-3 h-3" />
                        새로고침
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2.5 p-4 bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl border border-sky-100/60">
                      {avatars.map((url, idx) => (
                        <button
                          key={url}
                          type="button"
                          onClick={() => selectAvatar(url)}
                          className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                            form.memberProfileImg === url
                              ? 'border-sky-400 ring-2 ring-sky-200 shadow-lg shadow-sky-200/50'
                              : 'border-transparent hover:border-sky-200'
                          }`}
                        >
                          <img src={url} alt={`아바타 ${idx + 1}`} loading="lazy" className="w-full h-full object-cover bg-white" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 커스텀 꾸미기 모드 */}
                {avatarMode === 'custom' && (
                  <div>
                    {/* 미리보기 */}
                    <div className="flex justify-center mb-4">
                      <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-sky-100 to-cyan-100 border-2 border-sky-200/60 overflow-hidden shadow-lg shadow-sky-200/30 p-1">
                        <img src={customAvatarUrl} alt="내 아바타" loading="lazy" className="w-full h-full object-cover rounded-2xl bg-white" />
                      </div>
                    </div>

                    {/* 카테고리 선택 */}
                    <div className="flex gap-1 flex-wrap mb-3">
                      {Object.entries(AVATAR_PARTS).map(([key, { label }]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActiveCategory(key)}
                          className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                            activeCategory === key
                              ? 'bg-gradient-to-r from-sky-400 to-cyan-400 text-white shadow-sm shadow-sky-200/50'
                              : 'bg-sky-50 text-slate-600 hover:bg-sky-100 border border-sky-100'
                          }`}
                          style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* 옵션 그리드 */}
                    <div className="max-h-36 overflow-y-auto p-3 bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl border border-sky-100/60">
                      {AVATAR_PARTS[activeCategory].type === 'color' ? (
                        <div className="flex gap-2.5 flex-wrap justify-center">
                          {AVATAR_PARTS[activeCategory].options.map(({ value, color }) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => updateCustomPart(activeCategory, value)}
                              className={`w-9 h-9 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                                customParts[activeCategory] === value
                                  ? 'border-sky-400 ring-2 ring-sky-200 scale-110'
                                  : 'border-slate-200 hover:border-sky-300'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-1.5">
                          {AVATAR_PARTS[activeCategory].options.map(({ value, label }) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => updateCustomPart(activeCategory, value)}
                              className={`px-2 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
                                customParts[activeCategory] === value
                                  ? 'bg-gradient-to-r from-sky-400 to-cyan-400 text-white shadow-sm'
                                  : 'bg-white text-slate-600 hover:bg-sky-50 border border-sky-100'
                              }`}
                              style={{ fontFamily: "'Pretendard', sans-serif" }}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 이미지 업로드 모드 */}
                {avatarMode === 'upload' && (
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl border border-sky-100/60">
                    <label className="flex flex-col items-center justify-center w-full py-8 rounded-xl border-2 border-dashed border-sky-200 bg-white/60 cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition-all duration-300 group">
                      {uploading ? (
                        <Loader2 className="w-10 h-10 text-sky-400 animate-spin mb-2" />
                      ) : (
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                          <ImagePlus className="w-10 h-10 text-sky-300 group-hover:text-sky-400 transition-colors mb-2" />
                        </motion.div>
                      )}
                      <span className="text-sm font-semibold text-slate-500 group-hover:text-sky-500 transition-colors"
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        {uploading ? '업로드 중...' : '클릭하여 이미지 선택'}
                      </span>
                      <span className="text-xs text-slate-400 mt-1" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                        JPG, PNG, GIF (최대 5MB)
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* 선택 완료 메시지 */}
                {form.memberProfileImg && (
                  <p
                    className="text-sky-500 text-xs mt-3 flex items-center gap-1.5 font-medium bg-sky-50 px-3 py-2 rounded-xl"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> 아바타가 선택되었습니다
                  </p>
                )}
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
                    maxLength={10}
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
                  name="memberIntro"
                  value={form.memberIntro}
                  onChange={handleChange}
                  rows={3}
                  maxLength={200}
                  placeholder="자기소개를 입력해주세요"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none transition-all text-sm resize-none"
                />
                <p className="text-xs text-slate-400 text-right mt-1">{form.memberIntro.length}/200</p>
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
