import { AuthProvider } from './components/AuthContext';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClientInstance } from './lib/query-client';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/common/PageTransition';
import Login from './components/Login';
import Signup from './components/Signup';
import FindPassword from './components/FindPassword';
import Main from './components/Main';
import Accommodations from './pages/Accommodations';
import AccommodationDetail from './pages/AccommodationDetail';
import OAuthCallback from './components/OAuthCallback';
import MyPage from './components/Mypage';
import Companions from './pages/Companions';
import CompanionDetail from './pages/CompanionDetail';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Main /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/find-password" element={<PageTransition><FindPassword /></PageTransition>} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/accommodations" element={<PageTransition><Accommodations /></PageTransition>} />
        <Route path="/accommodations/:accommodationNo" element={<PageTransition><AccommodationDetail /></PageTransition>} />
        <Route path="/mypage" element={<PageTransition><MyPage /></PageTransition>} />
        <Route path="/companions" element={<PageTransition><Companions /></PageTransition>} />
        <Route path="/companions/:companionNo" element={<PageTransition><CompanionDetail /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-b from-sky-50 to-cyan-50">
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
