import { useContext } from 'react';
import { AuthContext, AuthProvider } from './components/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Main from './components/Main';

function App() {
  return (
    <AuthProvider>
      <AppComponent />
    </AuthProvider>
  );
}

function AppComponent() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user ? (
        // 로그인 상태: base44 UI 적용된 Main
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-cyan-50">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Main />} />
              {/* 추가 라우트 */}
            </Routes>
          </BrowserRouter>
        </div>
      ) : (
        // 비로그인: 기존 Login/Signup
        <div className="min-h-screen bg-gradient-to-br from-jeju-50 to-emerald-50">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </>
  );
}

export default App;
