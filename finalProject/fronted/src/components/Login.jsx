import React, { useContext } from 'react';
import "../css/Login.css";
import { AuthContext } from './AuthContext';

/**
 * 로그인 컴포넌트 (학원 패턴)
 * - useContext로 AuthContext 사용
 * - globalState에서 함수 가져오기
 */

function Login() {
  const globalState = useContext(AuthContext);

  return (
    <div className="login-container">
      <h1>혼행</h1>
      <p className="subtitle">제주도 혼자 여행하는 사람들의 커뮤니티</p>
      <h2>로그인</h2>
      
      <form onSubmit={globalState.handleLogin}>
        <div className="form-group">
          <label htmlFor="email">이메일:</label>
          <input 
            type="email" 
            id="email" 
            required 
            value={globalState.email}
            onChange={globalState.changeInputEmail}
            placeholder="example@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호:</label>
          <input 
            type="password" 
            id="password" 
            required 
            value={globalState.password}
            onChange={globalState.changeInputPw}
            placeholder="비밀번호 입력"
          />
        </div>

        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;