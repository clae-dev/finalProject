import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import MyPage from './MyPage';
import "../css/Main.css";

/**
 * 메인 컴포넌트 (학원 패턴)
 * - 로그인 후 보이는 메인 화면
 * - 헤더 + 라우팅 포함
 */

function Main() {
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    alert('로그아웃되었습니다.');
  };

  return (
    <div className="main-container">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <h1 onClick={() => navigate('/')}>혼행</h1>
          <nav>
            <span className="user-info">안녕하세요, {user.memberNickname}님</span>
            <Link to="/mypage">마이페이지</Link>
            <button onClick={onLogout}>로그아웃</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </main>
    </div>
  );
}

// 홈 페이지 (임시)
function HomePage() {
  return (
    <div className="home-page">
      <h2>제주도 혼자 여행하는 사람들의 커뮤니티</h2>
      <p>게스트하우스 정보, 후기, 동행 찾기까지 한 곳에서</p>

      <div className="feature-grid">
        <div className="feature-card">
          <h3>숙소 정보</h3>
          <p>제주도 게스트하우스 정보를 확인하세요</p>
        </div>
        <div className="feature-card">
          <h3>후기</h3>
          <p>실제 혼행러들의 솔직한 후기를 읽어보세요</p>
        </div>
        <div className="feature-card">
          <h3>동행 찾기</h3>
          <p>함께 여행할 동행을 찾아보세요</p>
        </div>
      </div>
    </div>
  );
}

export default Main;