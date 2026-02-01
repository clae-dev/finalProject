import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import "../css/MyPage.css";

/**
 * 마이페이지 컴포넌트 (학원 패턴)
 * - 로그인한 사용자 정보 표시
 */

function MyPage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="mypage-container">
      <h2>마이페이지</h2>

      <div className="user-info-card">
        <div className="info-row">
          <span className="label">회원 번호:</span>
          <span className="value">{user.memberNo}</span>
        </div>
        <div className="info-row">
          <span className="label">이름:</span>
          <span className="value">{user.memberName}</span>
        </div>
        <div className="info-row">
          <span className="label">닉네임:</span>
          <span className="value">{user.memberNickname}</span>
        </div>
        <div className="info-row">
          <span className="label">이메일:</span>
          <span className="value">{user.memberEmail}</span>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="btn-primary"
          onClick={() => alert('프로필 수정 기능은 준비 중입니다.')}
        >
          프로필 수정
        </button>
        <button 
          className="btn-secondary"
          onClick={() => alert('내 활동 조회 기능은 준비 중입니다.')}
        >
          내 활동 조회
        </button>
      </div>
    </div>
  );
}

export default MyPage;