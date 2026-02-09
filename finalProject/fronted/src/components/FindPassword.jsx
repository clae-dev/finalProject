import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle2, User, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import bgImage from '@/assets/images/협재.png';

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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:80'

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
        alert('인증코드가 이메일로 발송되었습니다.');
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
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="협재 해변"
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/8 via-cyan-400/5 to-blue-400/8" />
      </div>

      {/* 장식 요소 */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '2.5s' }} />

      {/* 떠다니는 작은 원들 */}
      <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-cyan-200/10 rounded-full blur-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <div className="absolute top-2/3 right-1/3 w-24 h-24 bg-blue-200/10 rounded-full blur-xl animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />

      {/* Wave SVG */}
      <div className="absolute bottom-0 left-0 right-0 opacity-20">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="white"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-5">
        <div className="w-full max-w-md">
          {/* 로고 및 서비스 이름 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-2 mb-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h1 className="text-4xl font-bold drop-shadow-lg">
                <span className="text-white">혼</span>
                <span className="text-cyan-100">디</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 text-sm font-medium tracking-wider"
            >
              HONDI
            </motion.p>
          </motion.div>

          {/* 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-500/20 p-8 border border-white/40"
          >
            {/* 뒤로가기 버튼 */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              로그인으로 돌아가기
            </Link>

            {/* 진행 단계 표시 */}
            <div className="flex items-center justify-center mb-8 gap-2">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: step === s ? 1.1 : 1,
                      backgroundColor: step >= s ? '#0ea5e9' : '#e2e8f0'
                    }}
                    transition={{ duration: 0.3 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      step >= s ? 'text-white shadow-lg shadow-sky-200' : 'text-slate-400'
                    }`}
                  >
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </motion.div>
                  {s < 3 && (
                    <div className={`w-12 h-1 rounded-full transition-all duration-500 ${
                      step > s ? 'bg-sky-400' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* 헤더 */}
            <div className="text-center mb-8">
              <motion.div
                key={step}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-sky-200"
              >
                {step === 1 && <User className="w-8 h-8 text-white" />}
                {step === 2 && <Mail className="w-8 h-8 text-white" />}
                {step === 3 && <KeyRound className="w-8 h-8 text-white" />}
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                비밀번호 찾기
              </h2>
              <motion.p
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-slate-500 text-sm"
              >
                {step === 1 && '이름과 이메일을 입력해주세요'}
                {step === 2 && '이메일로 발송된 인증코드를 입력해주세요'}
                {step === 3 && '새로운 비밀번호를 설정해주세요'}
              </motion.p>
            </div>

            {/* Step 1: 이름/이메일 입력 */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    이름
                  </label>
                  <Input
                    type="text"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`h-12 ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`pl-11 h-12 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
                  )}
                </div>

                <Button
                  onClick={handleSendVerificationCode}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-sky-200"
                >
                  {loading ? '확인 중...' : '인증코드 발송'}
                </Button>

                {codeSent && (
                  <div className="text-center">
                    <Button
                      onClick={() => setStep(2)}
                      variant="ghost"
                      className="text-sky-600 hover:text-sky-700"
                    >
                      인증코드 입력하러 가기 →
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: 인증코드 입력 */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
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
                        className={`h-12 ${errors.verificationCode ? 'border-red-500' : ''}`}
                      />
                      {timer > 0 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-rose-500">
                          {formatTime(timer)}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={handleSendVerificationCode}
                      variant="outline"
                      className="h-12 px-4 border-slate-300"
                      disabled={timer > 0}
                    >
                      재발송
                    </Button>
                  </div>
                  {errors.verificationCode && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.verificationCode}</p>
                  )}
                </div>

                <Button
                  onClick={handleVerifyCode}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-sky-200"
                >
                  {loading ? '확인 중...' : '인증 확인'}
                </Button>

                <div className="text-center">
                  <Button
                    onClick={() => setStep(1)}
                    variant="ghost"
                    className="text-slate-500 hover:text-slate-700 text-sm"
                  >
                    이름/이메일 다시 입력
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: 비밀번호 변경 */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-700">이메일 인증이 완료되었습니다</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    새 비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="8~20자, 특수문자 포함"
                      value={formData.newPassword}
                      onChange={(e) => handleChange('newPassword', e.target.value)}
                      className={`pl-11 pr-11 h-12 ${errors.newPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    비밀번호 확인
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="비밀번호 재입력"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className={`pl-11 pr-11 h-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-sky-200"
                >
                  {loading ? '변경 중...' : '비밀번호 변경'}
                </Button>
              </form>
            )}
          </motion.div>

          {/* 추가 텍스트 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-white/80 text-sm mt-6"
          >
            제주 바다처럼 자유로운 여행, <span className="font-bold drop-shadow">혼디</span>와 함께
          </motion.p>
        </div>
      </div>
    </div>
  );
}
