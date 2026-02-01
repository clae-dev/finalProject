import { useContext } from 'react';
import { AuthContext, AuthProvider } from './components/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Main from './components/Main';
import './css/App.css';

/**
 * App 컴포넌트 (학원 패턴)
 * - AuthProvider로 전체 감싸기
 * - 로그인 상태에 따라 화면 분기
 * - BrowserRouter는 로그인 후에만 적용
 */

function App() {
  return (
    <AuthProvider>
      <AppComponent />
    </AuthProvider>
  );
}

// 컴포넌트를 분리하여 하위 컴포넌트에서 useContext 사용하기
function AppComponent() {
  const { user } = useContext(AuthContext);
  // 로그인을 했다면 Main 렌더링
  // 로그인을 안했다면 Login/Signup 선택 화면 렌더링
  // -> 조건: 로그인 여부
  // -> user에는 로그인한 사람의 정보가 세팅
  // -> user는 AuthContext 안에 작성!
  // -> ContextAPI를 이용하여 렌더링 조건 처리

  return (
    <>
      {user ? (
        // 로그인 상태: Main 화면 (DashBoard)
        <div className="body-container">
          <BrowserRouter>
            <Main />
          </BrowserRouter>
        </div>
      ) : (
        // 비로그인 상태: Login/Signup 선택 화면
        <div className="auth-section">
          <AuthSelection />
        </div>
      )}
    </>
  );
}

// 로그인/회원가입 선택 화면
function AuthSelection() {
  return (
    <BrowserRouter>
      <Login />
      {/* TODO: 회원가입 링크 추가 */}
    </BrowserRouter>
  );
}

export default App;