import React, { useState, useCallback, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, Eye, EyeOff, User, Send, CheckCircle2, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { axiosApi } from '../api/axiosAPI';
import logo from '@/assets/images/혼디.png';
import bgImage from '@/assets/images/협재.png';

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
};

const buildCustomAvatarUrl = (parts) => {
  const params = new URLSearchParams();
  Object.entries(parts).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  if (parts.accessories) params.set('accessoriesProbability', '100');
  if (parts.facialHair) params.set('facialHairProbability', '100');
  return `https://api.dicebear.com/9.x/avataaars/svg?${params.toString()}`;
};

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    gender: '',
    age_group: '',
    profileImg: ''
  });
  const [avatars, setAvatars] = useState(() => generateAvatars());

  const refreshAvatars = useCallback(() => {
    setAvatars(generateAvatars());
    setFormData(prev => ({ ...prev, profileImg: '' }));
  }, []);

  // 아바타 모드: 'random' | 'custom'
  const [avatarMode, setAvatarMode] = useState('random');
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
  });
  const [activeCategory, setActiveCategory] = useState('top');

  const customAvatarUrl = useMemo(() => buildCustomAvatarUrl(customParts), [customParts]);

  const switchAvatarMode = useCallback((mode) => {
    setAvatarMode(mode);
    if (mode === 'custom') {
      setFormData(prev => ({ ...prev, profileImg: buildCustomAvatarUrl(customParts) }));
    } else {
      setFormData(prev => ({ ...prev, profileImg: '' }));
    }
  }, [customParts]);

  const updateCustomPart = useCallback((category, value) => {
    setCustomParts(prev => {
      const newParts = { ...prev, [category]: value };
      setFormData(fd => ({ ...fd, profileImg: buildCustomAvatarUrl(newParts) }));
      return newParts;
    });
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false
  });
  const [errors, setErrors] = useState({});
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const validateNickname = (nickname) => {
    if (!nickname) return '닉네임을 입력해주세요';
    if (nickname.length < 2 || nickname.length > 10) return '닉네임은 2~10자로 입력해주세요';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return '이메일을 입력해주세요';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return '올바른 이메일 형식이 아닙니다';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return '비밀번호를 입력해주세요';
    if (password.length < 8 || password.length > 20) return '비밀번호는 8~20자로 입력해주세요';
    if (!/[!@#$%^&*]/.test(password)) return '특수문자를 포함해야 합니다';
    return '';
  };

  const handleSendVerificationCode = async () => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
      return;
    }

    setIsSending(true);
    setErrors(prev => ({ ...prev, email: '', verificationCode: '' }));

    try {
      const response = await axiosApi.post('/api/email/send-code', {
        email: formData.email
      });

      if (response.data.success) {
        setIsCodeSent(true);
        setTimer(180); // 3분 타이머
        setVerificationCode('');
        alert('인증 코드가 발송되었습니다. 이메일을 확인해주세요.');
      } else {
        setErrors(prev => ({ ...prev, email: response.data.message || '인증 코드 발송에 실패했습니다.' }));
      }
    } catch (error) {
      console.error('인증 코드 발송 실패:', error);
      const errorMessage = error.response?.data?.message || '인증 코드 발송 중 오류가 발생했습니다.';
      setErrors(prev => ({ ...prev, email: errorMessage }));
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setErrors(prev => ({ ...prev, verificationCode: '인증 코드를 입력해주세요' }));
      return;
    }

    setIsVerifying(true);

    try {
      const response = await axiosApi.post('/api/email/verify-code', {
        email: formData.email,
        code: verificationCode
      });

      if (response.data.success) {
        setIsVerified(true);
        setTimer(0);
        setErrors(prev => ({ ...prev, verificationCode: '' }));
      } else {
        setErrors(prev => ({ ...prev, verificationCode: response.data.message || '인증 코드가 일치하지 않습니다' }));
      }
    } catch (error) {
      console.error('인증 코드 검증 실패:', error);
      const errorMessage = error.response?.data?.message || '인증 코드 검증 중 오류가 발생했습니다.';
      setErrors(prev => ({ ...prev, verificationCode: errorMessage }));
    } finally {
      setIsVerifying(false);
    }
  };

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // 유효성 검사
    if (!formData.name) newErrors.name = '이름을 입력해주세요';

    const nicknameError = validateNickname(formData.nickname);
    if (nicknameError) newErrors.nickname = nicknameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!isVerified) newErrors.verificationCode = '이메일 인증을 완료해주세요';
    if (!formData.gender) newErrors.gender = '성별을 선택해주세요';
    if (!formData.age_group) newErrors.age_group = '연령대를 선택해주세요';

    if (!agreements.terms) newErrors.terms = '이용약관에 동의해주세요';
    if (!agreements.privacy) newErrors.privacy = '개인정보 처리방침에 동의해주세요';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // 회원가입 API 호출
      setIsSubmitting(true);

      try {
        // 백엔드 DTO 형식에 맞게 데이터 변환
        const signupData = {
          memberEmail: formData.email,
          memberPw: formData.password,
          memberNickname: formData.nickname,
          memberName: formData.name,
          memberPhone: '',  // 전화번호는 선택사항
          memberGender: formData.gender === 'male' ? 'M' : 'F',
          memberAgeGroup: formData.age_group,
          memberProfileImg: formData.profileImg || null
        };

        const response = await axiosApi.post('/api/member/signup', signupData);

        if (response.data.success) {
          alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
          window.location.href = '/login';
        } else {
          alert(response.data.message || '회원가입에 실패했습니다.');
        }
      } catch (error) {
        console.error('회원가입 실패:', error);
        console.error('에러 응답:', error.response?.data);
        const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
        alert(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 실시간 오류 메시지 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden">
      {/* 제주 바다 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="협재 해변"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/70 via-cyan-500/60 to-blue-500/70" />
      </div>

      {/* 배경 장식 */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* 파도 배경 */}
      <svg className="absolute bottom-0 w-full opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="white" d="M0,160 C200,200 400,120 600,160 C800,200 1000,120 1200,160 C1350,180 1440,140 1440,140 L1440,320 L0,320 Z" />
      </svg>

      {/* 회원가입 카드 */}
      <div className="relative w-full max-w-4xl z-10 my-8">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-sky-900/30 p-10 border border-white/50">
          {/* 홈으로 돌아가기 */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 font-medium transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </button>

          {/* 로고 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <img src={logo} alt="혼디" className="h-20" />
              <div className="flex flex-col leading-tight text-left">
                <span className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent tracking-wide">HONDI</span>
                <span className="text-sm font-medium text-slate-400">혼디</span>
              </div>
            </div>
            <p className="text-slate-500">제주 바다처럼 자유로운 여행</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-full text-xs font-medium text-sky-600 mt-4">
              <span>✨</span>
              <span>지금 바로 혼디를 시작하세요</span>
            </div>
          </div>

          {/* 회원가입 폼 - 2컬럼 레이아웃 */}
          <form onSubmit={handleSubmit}>
            <div className="flex gap-8">

              {/* 왼쪽: 아바타 선택 */}
              <div className="w-80 shrink-0 space-y-4">
                {/* 아바타 선택 */}
                <div>
                  {/* 탭 전환 */}
                  <div className="flex rounded-xl bg-slate-100 p-1 mb-3">
                    <button
                      type="button"
                      onClick={() => switchAvatarMode('random')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                        avatarMode === 'random'
                          ? 'bg-white text-sky-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      랜덤 선택
                    </button>
                    <button
                      type="button"
                      onClick={() => switchAvatarMode('custom')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                        avatarMode === 'custom'
                          ? 'bg-white text-sky-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      직접 꾸미기
                    </button>
                  </div>

                  {/* 랜덤 선택 모드 */}
                  {avatarMode === 'random' && (
                    <div>
                      <div className="flex items-center justify-end mb-2">
                        <button
                          type="button"
                          onClick={refreshAvatars}
                          className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          새로고침
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        {avatars.map((url, idx) => (
                          <button
                            key={url}
                            type="button"
                            onClick={() => handleChange('profileImg', url)}
                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                              formData.profileImg === url
                                ? 'border-sky-400 ring-2 ring-sky-200 shadow-md'
                                : 'border-transparent hover:border-slate-300'
                            }`}
                          >
                            <img src={url} alt={`아바타 ${idx + 1}`} className="w-full h-full object-cover bg-white" />
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
                        <div className="w-28 h-28 rounded-2xl bg-white border-2 border-sky-200 overflow-hidden shadow-md">
                          <img src={customAvatarUrl} alt="내 아바타" className="w-full h-full object-cover" />
                        </div>
                      </div>

                      {/* 카테고리 선택 */}
                      <div className="flex gap-1 flex-wrap mb-3">
                        {Object.entries(AVATAR_PARTS).map(([key, { label }]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setActiveCategory(key)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                              activeCategory === key
                                ? 'bg-sky-500 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      {/* 옵션 그리드 */}
                      <div className="max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                        {AVATAR_PARTS[activeCategory].type === 'color' ? (
                          <div className="flex gap-2 flex-wrap justify-center">
                            {AVATAR_PARTS[activeCategory].options.map(({ value, color }) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => updateCustomPart(activeCategory, value)}
                                className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                                  customParts[activeCategory] === value
                                    ? 'border-sky-400 ring-2 ring-sky-200 scale-110'
                                    : 'border-slate-300'
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
                                className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  customParts[activeCategory] === value
                                    ? 'bg-sky-500 text-white shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 선택 완료 메시지 */}
                  {formData.profileImg && (
                    <p className="text-sky-600 text-xs mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 아바타가 선택되었습니다
                    </p>
                  )}
                </div>

                {/* 성별, 연령대 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">성별</label>
                    <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                      <SelectTrigger className={`h-12 bg-slate-50 border-slate-200 ${errors.gender ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">남성</SelectItem>
                        <SelectItem value="female">여성</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">연령대</label>
                    <Select value={formData.age_group} onValueChange={(value) => handleChange('age_group', value)}>
                      <SelectTrigger className={`h-12 bg-slate-50 border-slate-200 ${errors.age_group ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20s">20대</SelectItem>
                        <SelectItem value="30s">30대</SelectItem>
                        <SelectItem value="40s">40대</SelectItem>
                        <SelectItem value="50s">50대</SelectItem>
                        <SelectItem value="60s+">60대 이상</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.age_group && <p className="text-red-500 text-xs mt-1">{errors.age_group}</p>}
                  </div>
                </div>

                {/* 약관 동의 */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={agreements.terms}
                      onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, terms: checked }))}
                      className={`border-slate-300 mt-0.5 ${errors.terms ? 'border-red-500' : ''}`}
                    />
                    <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                      <span className="text-sky-600 font-semibold">(필수)</span> 이용약관에 동의합니다
                    </label>
                  </div>
                  {errors.terms && <p className="text-red-500 text-xs ml-6">{errors.terms}</p>}

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="privacy"
                      checked={agreements.privacy}
                      onCheckedChange={(checked) => setAgreements(prev => ({ ...prev, privacy: checked }))}
                      className={`border-slate-300 mt-0.5 ${errors.privacy ? 'border-red-500' : ''}`}
                    />
                    <label htmlFor="privacy" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                      <span className="text-sky-600 font-semibold">(필수)</span> 개인정보 처리방침에 동의합니다
                    </label>
                  </div>
                  {errors.privacy && <p className="text-red-500 text-xs ml-6">{errors.privacy}</p>}
                </div>
              </div>

              {/* 오른쪽: 입력 폼 */}
              <div className="flex-1 space-y-4">
                {/* 이름 + 닉네임 가로 배치 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">이름</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={`h-12 pl-12 bg-slate-50 border-slate-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl ${errors.name ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">닉네임</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="2~10자 한글/영문"
                        value={formData.nickname}
                        onChange={(e) => handleChange('nickname', e.target.value)}
                        maxLength={10}
                        className={`h-12 pl-12 bg-slate-50 border-slate-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl ${errors.nickname ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.nickname && <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>}
                  </div>
                </div>

                {/* 이메일 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">이메일 (아이디)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      autoComplete="off"
                      className={`h-12 pl-12 bg-slate-50 border-slate-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* 비밀번호 + 비밀번호 확인 가로 배치 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">비밀번호</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="특수문자 포함 8~20자"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        autoComplete="new-password"
                        className={`h-12 pl-12 pr-12 bg-slate-50 border-slate-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl ${errors.password ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">비밀번호 확인</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="비밀번호 재입력"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        autoComplete="new-password"
                        className={`h-12 pl-12 pr-12 bg-slate-50 border-slate-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* 이메일 인증 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">이메일 인증</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      type="text"
                      value={formData.email}
                      disabled
                      className="h-12 bg-slate-100 border-slate-200 rounded-xl text-slate-500"
                    />
                    <Button
                      type="button"
                      onClick={handleSendVerificationCode}
                      disabled={!formData.email || isVerified || isSending}
                      className={`h-12 px-6 rounded-xl whitespace-nowrap ${isVerified ? 'bg-green-500' : 'bg-sky-500 hover:bg-sky-600'}`}
                    >
                      {isVerified ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          인증완료
                        </>
                      ) : isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          발송중
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-1" />
                          {isCodeSent ? '재발송' : '인증요청'}
                        </>
                      )}
                    </Button>
                  </div>

                  {isCodeSent && !isVerified && (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type="text"
                          placeholder="인증 코드 입력"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className={`h-12 bg-slate-50 border-slate-200 focus:border-sky-400 focus:ring-sky-400 rounded-xl ${errors.verificationCode ? 'border-red-500' : ''}`}
                        />
                        {timer > 0 && (
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-red-500 font-medium">
                            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={isVerifying || !verificationCode}
                        className="h-12 px-6 bg-sky-500 hover:bg-sky-600 rounded-xl whitespace-nowrap"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            확인중
                          </>
                        ) : (
                          '확인'
                        )}
                      </Button>
                    </div>
                  )}

                  {errors.verificationCode && <p className="text-red-500 text-xs mt-1">{errors.verificationCode}</p>}
                  {isVerified && <p className="text-green-600 text-xs mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 이메일 인증이 완료되었습니다</p>}
                </div>
              </div>

            </div>

            {/* 회원가입 버튼 - 하단 전체 너비 */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold text-base rounded-xl shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all mt-6 disabled:opacity-70"
            >
              회원가입
            </Button>
          </form>

          {/* 로그인 링크 */}
          <div className="text-center mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              이미 계정이 있으신가요?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sky-600 hover:text-sky-700 font-semibold transition-colors"
              >
                로그인
              </button>
            </p>
          </div>
        </div>

        {/* 하단 장식 텍스트 */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-white/90 text-sm drop-shadow font-medium">
            🌊 파도 소리와 함께 새로운 여정을 시작하세요
          </p>
          <p className="text-white/70 text-xs drop-shadow">
            제주의 푸른 바다가 당신을 기다리고 있어요
          </p>
        </div>
      </div>
    </div>
  );
}