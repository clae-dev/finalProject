import { AuthProvider } from './components/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClientInstance } from './lib/query-client';
import Login from './components/Login';
import Signup from './components/Signup';
import FindPassword from './components/FindPassword';
import Main from './components/Main';
import Accommodations from './pages/Accommodations';
import AccommodationDetail from './pages/AccommodationDetail';
import OAuthCallback from './components/OAuthCallback';
import MyPage from './components/Mypage';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-b from-sky-50 to-cyan-50">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/find-password" element={<FindPassword />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />
              <Route path="/accommodations" element={<Accommodations />} />
              <Route path="/accommodations/:accommodationNo" element={<AccommodationDetail />} />
              <Route path="/mypage" element={<MyPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
