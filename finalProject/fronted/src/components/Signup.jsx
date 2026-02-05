import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, Eye, EyeOff, User, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { axiosApi } from '../api/axiosAPI';
import logo from '@/assets/images/혼디.png';
import bgImage from '@/assets/images/협재.png';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    gender: '',
    age_group: ''
  });
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

  const handleSubmit = (e) => {
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
      // 회원가입 처리
      console.log('회원가입 데이터:', formData);
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
      <div className="relative w-full max-w-md z-10 my-8">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-sky-900/30 p-10 border border-white/50">
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

          {/* 회원가입 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이름 */}
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

            {/* 닉네임 */}
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

            {/* 비밀번호 */}
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

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">비밀번호 확인</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
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

            {/* 성별, 연령대 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">성별</label>
                <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                  <SelectTrigger className={`h-12 bg-slate-50 border-slate-200 ${errors.gender ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">남성</SelectItem>
                    <SelectItem value="female">여성</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
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
            <div className="space-y-3 pt-2 pb-2">
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

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold text-base rounded-xl shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all mt-4"
            >
              회원가입
            </Button>
          </form>

          {/* 로그인 링크 */}
          <div className="text-center mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              이미 계정이 있으신가요?{' '}
              <button className="text-sky-600 hover:text-sky-700 font-semibold transition-colors">
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