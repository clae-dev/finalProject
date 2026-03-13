import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle2, User, KeyRound, Send, Loader2, ShieldCheck } from 'lucide-react';
import bgImage from '@/assets/images/auth/협재.webp';
import logo from '@/assets/images/logo/혼디.webp';

export default function FindPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 이메일입력, 2: 인증코드, 3: 비밀번호변경
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || ''

  // 타이머 카운트다운
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // 이메일 검증
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return '이메일을 입력해주세요';
    if (!emailRegex.test(email)) return '올바른 이메일 형식이 아닙니다';
    return '';
  };

  // 비밀번호 검증
  const validatePassword = (password) => {
    if (!password) return '비밀번호를 입력해주세요';
    if (password.length < 8 || password.length > 20) return '비밀번호는 8~20자여야 합니다';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return '특수문자를 포함해야 합니다';
    return '';
  };

  // 인증코드 발송
  const handleSendVerificationCode = async () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // 1. 회원 존재 여부 확인
      const findRes = await fetch(
        `${API_URL}/api/member/find-password?memberEmail=${encodeURIComponent(formData.email)}&memberName=${encodeURIComponent(formData.name)}`,
        { method: 'POST' }
      );
      const findData = await findRes.json();

      if (!findData.success) {
        setErrors({ email: findData.message || '일치하는 회원 정보를 찾을 수 없습니다.' });
        setLoading(false);
        return;
      }

      // 2. 인증코드 발송
      const codeRes = await fetch(`${API_URL}/api/email/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const codeData = await codeRes.json();

      if (codeData.success) {
        setCodeSent(true);
        setTimer(180);
        setErrors({});
        setStep(2);
      } else {
        setErrors({ email: codeData.message || '인증코드 발송에 실패했습니다.' });
      }
    } catch (e) {
      setErrors({ email: '서버 연결에 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  // 인증코드 확인
  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      setErrors({ verificationCode: '인증코드를 입력해주세요' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/email/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: formData.verificationCode })
      });
      const data = await res.json();

      if (data.success) {
        setStep(3);
        setErrors({});
      } else {
        setErrors({ verificationCode: data.message || '인증코드가 일치하지 않거나 만료되었습니다.' });
      }
    } catch (e) {
      setErrors({ verificationCode: '서버 연결에 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 변경
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) newErrors.newPassword = passwordError;

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/member/reset-password?memberEmail=${encodeURIComponent(formData.email)}&newPw=${encodeURIComponent(formData.newPassword)}`,
        { method: 'PUT' }
      );
      const data = await res.json();

      if (data.success) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        navigate('/login');
      } else {
        setErrors({ newPassword: data.message || '비밀번호 변경에 실패했습니다.' });
      }
    } catch (e) {
      setErrors({ newPassword: '서버 연결에 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // 비밀번호 필드 실시간 검증
    if (field === 'newPassword') {
      const pwError = validatePassword(value);
      setErrors(prev => ({ ...prev, newPassword: value ? pwError : '' }));
      // 비밀번호 확인도 함께 검증
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다' }));
      } else if (formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    } else if (field === 'confirmPassword') {
      if (value && formData.newPassword !== value) {
        setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stepLabels = ['본인 확인', '이메일 인증', '비밀번호 변경'];
  const stepIcons = [User, Mail, KeyRound];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-sky-50 to-cyan-50">
      {/* 배경 이미지 - 상단 히어로 영역 */}
      <div className="absolute top-0 left-0 right-0 h-[380px]">
        <img src={bgImage} alt="협재 해변" loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 via-sky-800/40 to-sky-50" />
      </div>

      {/* 상단 장식 블러 원형 */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 -right-20 w-80 h-80 bg-sky-300/20 rounded-full blur-3xl" />

      {/* 상단 네비게이션 */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-white/80 hover:text-white font-medium transition-colors duration-300 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-white/80 hover:text-white font-medium transition-colors duration-300 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            로그인
          </button>
        </div>
      </div>

      {/* 히어로 타이틀 */}
      <div className="relative z-10 text-center pt-8 pb-14">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src={logo} alt="혼디" className="h-14 drop-shadow-lg" />
          <div className="flex flex-col leading-tight text-left">
            <span
              className="text-3xl font-black text-white tracking-wider drop-shadow-lg"
              style={{ fontFamily: "'GmarketSans', sans-serif" }}
            >
              HONDI
            </span>
            <span
              className="text-[11px] font-semibold text-white/70 tracking-widest"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              혼디
            </span>
          </div>
        </div>
        <h1
          className="text-2xl font-bold text-white drop-shadow-md mb-2"
          style={{ fontFamily: "'GmarketSans', sans-serif" }}
        >
          비밀번호 찾기
        </h1>
        <p
          className="text-white/70 text-sm"
          style={{ fontFamily: "'Pretendard', sans-serif" }}
        >
          이메일 인증을 통해 비밀번호를 재설정할 수 있습니다
        </p>
      </div>

      {/* 웨이브 디바이더 */}
      <div className="relative z-10 -mt-4 -mb-1">
        <svg viewBox="0 0 1200 60" className="w-full h-12" preserveAspectRatio="none">
          <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z" fill="#f0f9ff" fillOpacity="0.6" />
          <path d="M0,40 C200,60 400,10 600,40 C800,60 1000,10 1200,40 L1200,60 L0,60 Z" fill="#f0f9ff" />
        </svg>
      </div>

      {/* 메인 카드 */}
      <div className="relative z-10 max-w-lg mx-auto px-6 pb-16">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-sky-200/40 border border-white/60 overflow-hidden">

          {/* 진행 단계 표시 바 */}
          <div className="bg-gradient-to-r from-sky-50 via-cyan-50 to-sky-50 px-8 py-5 border-b border-sky-100/60">
            <div className="flex items-center justify-center gap-4">
              {stepLabels.map((label, idx) => {
                const StepIcon = stepIcons[idx];
                const stepNum = idx + 1;
                const isActive = step >= stepNum;
                const isCurrent = step === stepNum;
                return (
                  <React.Fragment key={idx}>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? 'bg-gradient-to-r from-sky-400 to-cyan-400 shadow-md shadow-sky-200/50'
                          : 'bg-slate-200'
                      }`}>
                        {step > stepNum ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : (
                          <StepIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold hidden sm:block transition-colors duration-300 ${
                          isCurrent ? 'text-sky-600' : isActive ? 'text-sky-400' : 'text-slate-400'
                        }`}
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      >
                        {label}
                      </span>
                    </div>
                    {idx < 2 && (
                      <div className={`w-8 h-[2px] rounded-full transition-all duration-500 ${
                        step > stepNum ? 'bg-sky-400' : 'bg-slate-200'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* 폼 영역 */}
          <div className="p-8">
            {/* 스텝 아이콘 + 설명 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-2xl mb-4 border border-sky-200/60">
                {step === 1 && <User className="w-8 h-8 text-sky-500" />}
                {step === 2 && <Mail className="w-8 h-8 text-sky-500" />}
                {step === 3 && <KeyRound className="w-8 h-8 text-sky-500" />}
              </div>
              <h2
                className="text-xl font-bold text-slate-800 mb-1.5"
                style={{ fontFamily: "'GmarketSans', sans-serif" }}
              >
                {step === 1 && '본인 확인'}
                {step === 2 && '인증코드 입력'}
                {step === 3 && '새 비밀번호 설정'}
              </h2>
              <p
                className="text-slate-400 text-sm"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                {step === 1 && '가입 시 등록한 이름과 이메일을 입력해주세요'}
                {step === 2 && '이메일로 발송된 6자리 인증코드를 입력해주세요'}
                {step === 3 && '새로운 비밀번호를 설정해주세요'}
              </p>
            </div>

            {/* Step 1: 이름/이메일 입력 */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-semibold text-slate-600 mb-2"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    이름
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-400 transition-colors" />
                    <Input
                      type="text"
                      placeholder="가입 시 등록한 이름"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`h-12 pl-12 bg-white border-sky-100 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm hover:border-sky-200 transition-colors ${errors.name ? 'border-red-400' : ''}`}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.name}</p>}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold text-slate-600 mb-2"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    이메일
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-400 transition-colors" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`h-12 pl-12 bg-white border-sky-100 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm hover:border-sky-200 transition-colors ${errors.email ? 'border-red-400' : ''}`}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.email}</p>}
                </div>

                <Button
                  onClick={handleSendVerificationCode}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/50 hover:scale-[1.01] transition-all duration-300 mt-2"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      확인 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      인증코드 발송
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Step 2: 인증코드 입력 */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-sky-50 to-cyan-50/50 rounded-2xl p-4 border border-sky-100/60 mb-2">
                  <p
                    className="text-xs text-sky-600 font-medium flex items-center gap-1.5"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="font-bold">{formData.email}</span> 으로 인증코드가 발송되었습니다
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold text-slate-600 mb-2"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    인증코드
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        placeholder="6자리 코드 입력"
                        value={formData.verificationCode}
                        onChange={(e) => handleChange('verificationCode', e.target.value)}
                        maxLength={6}
                        className={`h-12 bg-white border-sky-100 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm text-center tracking-[0.3em] font-semibold ${errors.verificationCode ? 'border-red-400' : ''}`}
                        style={{ fontFamily: "'Pretendard', sans-serif" }}
                      />
                      {timer > 0 && (
                        <span
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-red-500 tabular-nums"
                          style={{ fontFamily: "'Pretendard', sans-serif" }}
                        >
                          {formatTime(timer)}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={handleSendVerificationCode}
                      variant="outline"
                      className="h-12 px-4 border-sky-200 text-sky-500 hover:bg-sky-50 rounded-xl text-sm font-semibold"
                      disabled={timer > 0 || loading}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      재발송
                    </Button>
                  </div>
                  {errors.verificationCode && <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.verificationCode}</p>}
                </div>

                <Button
                  onClick={handleVerifyCode}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/50 hover:scale-[1.01] transition-all duration-300 mt-2"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      확인 중...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      인증 확인
                    </>
                  )}
                </Button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setCodeSent(false); setTimer(0); }}
                    className="text-slate-400 hover:text-sky-500 text-xs font-medium transition-colors"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    이름/이메일 다시 입력
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: 비밀번호 변경 */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 rounded-2xl p-4 flex items-center gap-2.5 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <p
                    className="text-sm text-green-700 font-medium"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    이메일 인증이 완료되었습니다
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold text-slate-600 mb-2"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    새 비밀번호
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-400 transition-colors" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="8~20자, 특수문자 포함"
                      value={formData.newPassword}
                      onChange={(e) => handleChange('newPassword', e.target.value)}
                      className={`h-12 pl-12 pr-12 bg-white border-sky-100 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm hover:border-sky-200 transition-colors ${errors.newPassword ? 'border-red-400' : ''}`}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-sky-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.newPassword}</p>}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold text-slate-600 mb-2"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    비밀번호 확인
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-sky-400 transition-colors" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="비밀번호 재입력"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className={`h-12 pl-12 pr-12 bg-white border-sky-100 focus:border-sky-400 focus:ring-sky-400 rounded-xl text-sm hover:border-sky-200 transition-colors ${errors.confirmPassword ? 'border-red-400' : ''}`}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-sky-400 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>{errors.confirmPassword}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-200/50 hover:shadow-xl hover:shadow-sky-300/50 hover:scale-[1.01] transition-all duration-300 mt-2"
                  style={{ fontFamily: "'GmarketSans', sans-serif" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      변경 중...
                    </>
                  ) : (
                    '비밀번호 변경'
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* 로그인 링크 */}
          <div className="text-center pb-7 px-8">
            <p
              className="text-sm text-slate-500"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              비밀번호가 기억나셨나요?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sky-500 hover:text-sky-600 font-bold transition-colors"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                로그인
              </button>
            </p>
          </div>
        </div>

        {/* 하단 브랜드 텍스트 */}
        <div className="text-center mt-6">
          <p
            className="text-xs text-slate-400"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            HONDI - 혼자여서 더 자유로운 제주 여행
          </p>
        </div>
      </div>
    </div>
  );
}
