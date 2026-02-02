import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosApi } from '../api/axiosAPI';

/**
 * 회원가입 컴포넌트 (학원 패턴)
 * - 이메일, 닉네임 중복 확인
 * - 입력값 유효성 검증
 */

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    memberEmail: '',
    memberPw: '',
    memberPwConfirm: '',
    memberName: '',
    memberNickname: '',
    memberTel: '',
    memberGender: '',
    memberAge: ''
  });

  const [validation, setValidation] = useState({
    emailChecked: false,
    emailAvailable: false,
    nicknameChecked: false,
    nicknameAvailable: false
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 이메일/닉네임 변경 시 중복 확인 초기화
    if (name === 'memberEmail') {
      setValidation(prev => ({ ...prev, emailChecked: false, emailAvailable: false }));
    }
    if (name === 'memberNickname') {
      setValidation(prev => ({ ...prev, nicknameChecked: false, nicknameAvailable: false }));
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    if (!formData.memberEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      const response = await axiosApi.get('/api/member/check-email', {
        params: { memberEmail: formData.memberEmail }
      });

      setValidation(prev => ({
        ...prev,
        emailChecked: true,
        emailAvailable: response.data.success
      }));

      alert(response.data.message);
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
      alert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!formData.memberNickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (formData.memberNickname.length < 2 || formData.memberNickname.length > 10) {
      alert('닉네임은 2~10자여야 합니다.');
      return;
    }

    try {
      const response = await axiosApi.get('/api/member/check-nickname', {
        params: { memberNickname: formData.memberNickname }
      });

      setValidation(prev => ({
        ...prev,
        nicknameChecked: true,
        nicknameAvailable: response.data.success
      }));

      alert(response.data.message);
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
      alert('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 회원가입 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 입력값 검증
    if (!validation.emailChecked || !validation.emailAvailable) {
      alert('이메일 중복 확인을 완료해주세요.');
      return;
    }

    if (!validation.nicknameChecked || !validation.nicknameAvailable) {
      alert('닉네임 중복 확인을 완료해주세요.');
      return;
    }

    if (formData.memberPw !== formData.memberPwConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.memberPw.length < 8 || formData.memberPw.length > 20) {
      alert('비밀번호는 8~20자여야 합니다.');
      return;
    }

    try {
      const response = await axiosApi.post('/api/member/signup', {
        memberEmail: formData.memberEmail,
        memberPw: formData.memberPw,
        memberName: formData.memberName,
        memberNickname: formData.memberNickname,
        memberTel: formData.memberTel,
        memberGender: formData.memberGender,
        memberAge: formData.memberAge
      });

      if (response.data.success) {
        alert('회원가입이 완료되었습니다!');
        navigate('/'); // 메인으로 이동 (로그인 화면)
      } else {
        alert(response.data.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  // [수정] 공통 스타일 클래스 - CSS 파일의 유틸리티 클래스 활용
  const inputClass = "input-base";
  const labelClass = "label-base";

  return (
    // [수정] 반응형 패딩 적용
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-12">
      {/* [수정] 카드 스타일 개선 */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-5 sm:p-8 w-full max-w-lg border border-gray-100">

        {/* [수정] 로고 + 타이틀 - 제주 컬러 적용, 반응형 */}
        <div className="text-center mb-5 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            <span className="text-jeju-500">혼</span>
            <span className="text-emerald-400">행</span>
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">회원가입</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 */}
          <div>
            <label htmlFor="memberEmail" className={labelClass}>
              이메일 <span className="text-jeju-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                id="memberEmail"
                name="memberEmail"
                required
                value={formData.memberEmail}
                onChange={handleChange}
                placeholder="example@email.com"
                className={`${inputClass} flex-1`}
              />
              {/* [수정] 중복확인 버튼 - 공통 스타일 */}
              <button
                type="button"
                onClick={handleCheckEmail}
                className="btn-secondary whitespace-nowrap"
              >
                중복확인
              </button>
            </div>
            {/* [수정] 검증 메시지 - 공통 클래스 사용 */}
            {validation.emailChecked && (
              <p className={validation.emailAvailable ? 'success-text' : 'error-text'}>
                {validation.emailAvailable ? '사용 가능한 이메일입니다.' : '이미 사용 중인 이메일입니다.'}
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="memberPw" className={labelClass}>
              비밀번호 <span className="text-jeju-500">*</span>
              <span className="text-gray-400 font-normal ml-1">(8~20자)</span>
            </label>
            <input
              type="password"
              id="memberPw"
              name="memberPw"
              required
              value={formData.memberPw}
              onChange={handleChange}
              placeholder="비밀번호 입력"
              className={inputClass}
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="memberPwConfirm" className={labelClass}>
              비밀번호 확인 <span className="text-jeju-500">*</span>
            </label>
            <input
              type="password"
              id="memberPwConfirm"
              name="memberPwConfirm"
              required
              value={formData.memberPwConfirm}
              onChange={handleChange}
              placeholder="비밀번호 재입력"
              className={inputClass}
            />
          </div>

          {/* 이름 */}
          <div>
            <label htmlFor="memberName" className={labelClass}>
              이름 <span className="text-jeju-500">*</span>
            </label>
            <input
              type="text"
              id="memberName"
              name="memberName"
              required
              value={formData.memberName}
              onChange={handleChange}
              placeholder="홍길동"
              className={inputClass}
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label htmlFor="memberNickname" className={labelClass}>
              닉네임 <span className="text-jeju-500">*</span>
              <span className="text-gray-400 font-normal ml-1">(2~10자)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="memberNickname"
                name="memberNickname"
                required
                value={formData.memberNickname}
                onChange={handleChange}
                placeholder="여행자닉네임"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                className="btn-secondary whitespace-nowrap"
              >
                중복확인
              </button>
            </div>
            {validation.nicknameChecked && (
              <p className={validation.nicknameAvailable ? 'success-text' : 'error-text'}>
                {validation.nicknameAvailable ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.'}
              </p>
            )}
          </div>

          {/* 전화번호 */}
          <div>
            <label htmlFor="memberTel" className={labelClass}>
              전화번호 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <input
              type="tel"
              id="memberTel"
              name="memberTel"
              value={formData.memberTel}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className={inputClass}
            />
          </div>

          {/* 성별 - [수정] 라디오 버튼 스타일 개선 */}
          <div>
            <label className={labelClass}>
              성별 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <div className="flex gap-4 sm:gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="memberGender"
                  value="M"
                  checked={formData.memberGender === 'M'}
                  onChange={handleChange}
                  className="w-4 h-4 text-jeju-500 border-gray-300
                             focus:ring-2 focus:ring-jeju-500/40 focus:ring-offset-0"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">남성</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="memberGender"
                  value="F"
                  checked={formData.memberGender === 'F'}
                  onChange={handleChange}
                  className="w-4 h-4 text-jeju-500 border-gray-300
                             focus:ring-2 focus:ring-jeju-500/40 focus:ring-offset-0"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">여성</span>
              </label>
            </div>
          </div>

          {/* 연령대 */}
          <div>
            <label htmlFor="memberAge" className={labelClass}>
              연령대 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <select
              id="memberAge"
              name="memberAge"
              value={formData.memberAge}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">선택 안 함</option>
              <option value="10대">10대</option>
              <option value="20대">20대</option>
              <option value="30대">30대</option>
              <option value="40대">40대</option>
              <option value="50대 이상">50대 이상</option>
            </select>
          </div>

          {/* [수정] 제출 버튼 - 공통 스타일, 상단 마진 조정 */}
          <button type="submit" className="btn-primary !mt-6">
            회원가입
          </button>
        </form>

        <div className="mt-5 sm:mt-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            이미 계정이 있으신가요?{' '}
            <Link
              to="/"
              className="text-jeju-500 hover:text-jeju-600 font-semibold
                         focus:outline-none focus-visible:underline transition-colors"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
