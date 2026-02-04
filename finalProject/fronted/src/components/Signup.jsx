import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosApi } from '../api/axiosAPI';

/**
 * 회원가입 컴포넌트 (수정 버전)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'memberEmail') {
      setValidation(prev => ({ ...prev, emailChecked: false, emailAvailable: false }));
    }
    if (name === 'memberNickname') {
      setValidation(prev => ({ ...prev, nicknameChecked: false, nicknameAvailable: false }));
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        navigate('/');
      } else {
        alert(response.data.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-12 bg-jeju-gradient">
      <div className="card-gradient p-5 sm:p-8 w-full max-w-lg page-enter">

        <div className="text-center mb-5 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl mb-2">
            <span className="logo-jeju">혼</span>
            <span className="logo-emerald">디</span>
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">회원가입</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 */}
          <div>
            <label htmlFor="memberEmail" className="label-base">
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
                className="input-base flex-1"
              />
              <button
                type="button"
                onClick={handleCheckEmail}
                className="btn-secondary whitespace-nowrap px-5"
              >
                중복확인
              </button>
            </div>
            {validation.emailChecked && (
              <p className={validation.emailAvailable ? 'success-text' : 'error-text'}>
                {validation.emailAvailable ? 
                  <>✓ 사용 가능한 이메일입니다.</> : 
                  <>✗ 이미 사용 중인 이메일입니다.</>
                }
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div>
            <label htmlFor="memberNickname" className="label-base">
              닉네임 <span className="text-jeju-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="memberNickname"
                name="memberNickname"
                required
                value={formData.memberNickname}
                onChange={handleChange}
                placeholder="2~10자"
                className="input-base flex-1"
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                className="btn-secondary whitespace-nowrap px-5"
              >
                중복확인
              </button>
            </div>
            {validation.nicknameChecked && (
              <p className={validation.nicknameAvailable ? 'success-text' : 'error-text'}>
                {validation.nicknameAvailable ? 
                  <>✓ 사용 가능한 닉네임입니다.</> : 
                  <>✗ 이미 사용 중인 닉네임입니다.</>
                }
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="memberPw" className="label-base">
              비밀번호 <span className="text-jeju-500">*</span>
            </label>
            <input
              type="password"
              id="memberPw"
              name="memberPw"
              required
              value={formData.memberPw}
              onChange={handleChange}
              placeholder="8~20자"
              className="input-base"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="memberPwConfirm" className="label-base">
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
              className="input-base"
            />
            {formData.memberPwConfirm && (
              <p className={formData.memberPw === formData.memberPwConfirm ? 'success-text' : 'error-text'}>
                {formData.memberPw === formData.memberPwConfirm ? 
                  <>✓ 비밀번호가 일치합니다.</> : 
                  <>✗ 비밀번호가 일치하지 않습니다.</>
                }
              </p>
            )}
          </div>

          {/* 이름 */}
          <div>
            <label htmlFor="memberName" className="label-base">
              이름 <span className="text-jeju-500">*</span>
            </label>
            <input
              type="text"
              id="memberName"
              name="memberName"
              required
              value={formData.memberName}
              onChange={handleChange}
              placeholder="실명 입력"
              className="input-base"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label htmlFor="memberTel" className="label-base">
              전화번호 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <input
              type="tel"
              id="memberTel"
              name="memberTel"
              value={formData.memberTel}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className="input-base"
            />
          </div>

          {/* 성별 */}
          <div>
            <label htmlFor="memberGender" className="label-base">
              성별 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <select
              id="memberGender"
              name="memberGender"
              value={formData.memberGender}
              onChange={handleChange}
              className="input-base"
            >
              <option value="">선택 안 함</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>

          {/* 연령대 */}
          <div>
            <label htmlFor="memberAge" className="label-base">
              연령대 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <select
              id="memberAge"
              name="memberAge"
              value={formData.memberAge}
              onChange={handleChange}
              className="input-base"
            >
              <option value="">선택 안 함</option>
              <option value="10대">10대</option>
              <option value="20대">20대</option>
              <option value="30대">30대</option>
              <option value="40대">40대</option>
              <option value="50대 이상">50대 이상</option>
            </select>
          </div>

          <button type="submit" className="btn-primary !mt-6">
            회원가입
          </button>
        </form>

        <div className="mt-5 sm:mt-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            이미 계정이 있으신가요?{' '}
            <Link to="/" className="link-primary">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;