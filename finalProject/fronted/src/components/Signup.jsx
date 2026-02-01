import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosApi } from '../api/axiosAPI';
import "../css/Signup.css";

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

  return (
    <div className="signup-container">
      <h1>혼행</h1>
      <h2>회원가입</h2>

      <form onSubmit={handleSubmit}>
        {/* 이메일 */}
        <div className="form-group">
          <label htmlFor="memberEmail">이메일 *</label>
          <div className="input-with-button">
            <input
              type="email"
              id="memberEmail"
              name="memberEmail"
              required
              value={formData.memberEmail}
              onChange={handleChange}
              placeholder="example@email.com"
            />
            <button type="button" onClick={handleCheckEmail}>중복확인</button>
          </div>
          {validation.emailChecked && (
            <p className={validation.emailAvailable ? 'success' : 'error'}>
              {validation.emailAvailable ? '사용 가능한 이메일입니다.' : '이미 사용 중인 이메일입니다.'}
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="form-group">
          <label htmlFor="memberPw">비밀번호 * (8~20자)</label>
          <input
            type="password"
            id="memberPw"
            name="memberPw"
            required
            value={formData.memberPw}
            onChange={handleChange}
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="form-group">
          <label htmlFor="memberPwConfirm">비밀번호 확인 *</label>
          <input
            type="password"
            id="memberPwConfirm"
            name="memberPwConfirm"
            required
            value={formData.memberPwConfirm}
            onChange={handleChange}
          />
        </div>

        {/* 이름 */}
        <div className="form-group">
          <label htmlFor="memberName">이름 *</label>
          <input
            type="text"
            id="memberName"
            name="memberName"
            required
            value={formData.memberName}
            onChange={handleChange}
          />
        </div>

        {/* 닉네임 */}
        <div className="form-group">
          <label htmlFor="memberNickname">닉네임 * (2~10자)</label>
          <div className="input-with-button">
            <input
              type="text"
              id="memberNickname"
              name="memberNickname"
              required
              value={formData.memberNickname}
              onChange={handleChange}
            />
            <button type="button" onClick={handleCheckNickname}>중복확인</button>
          </div>
          {validation.nicknameChecked && (
            <p className={validation.nicknameAvailable ? 'success' : 'error'}>
              {validation.nicknameAvailable ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.'}
            </p>
          )}
        </div>

        {/* 전화번호 */}
        <div className="form-group">
          <label htmlFor="memberTel">전화번호 (선택)</label>
          <input
            type="tel"
            id="memberTel"
            name="memberTel"
            value={formData.memberTel}
            onChange={handleChange}
            placeholder="010-1234-5678"
          />
        </div>

        {/* 성별 */}
        <div className="form-group">
          <label>성별 (선택)</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="memberGender"
                value="M"
                checked={formData.memberGender === 'M'}
                onChange={handleChange}
              />
              남성
            </label>
            <label>
              <input
                type="radio"
                name="memberGender"
                value="F"
                checked={formData.memberGender === 'F'}
                onChange={handleChange}
              />
              여성
            </label>
          </div>
        </div>

        {/* 연령대 */}
        <div className="form-group">
          <label htmlFor="memberAge">연령대 (선택)</label>
          <select
            id="memberAge"
            name="memberAge"
            value={formData.memberAge}
            onChange={handleChange}
          >
            <option value="">선택 안 함</option>
            <option value="10대">10대</option>
            <option value="20대">20대</option>
            <option value="30대">30대</option>
            <option value="40대">40대</option>
            <option value="50대 이상">50대 이상</option>
          </select>
        </div>

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default Signup;