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
import Accommodations from './pages/accommodation/Accommodations';
import AccommodationDetail from './pages/accommodation/AccommodationDetail';
import OAuthCallback from './components/OAuthCallback';
import MyPage from './components/Mypage';
import Companions from './pages/companion/Companions';
import CompanionWrite from './pages/companion/CompanionWrite';
import CompanionDetail from './pages/companion/CompanionDetail';
import Reviews from './pages/review/Reviews';
import ReviewWrite from './pages/review/ReviewWrite';
import ReviewDetail from './pages/review/ReviewDetail';
import NotFound from './pages/error/NotFound';
import ServerError from './pages/error/ServerError';
import Forbidden from './pages/error/Forbidden';
import AdminPage from './pages/admin/AdminPage';
import FaqPage from './pages/faq/FaqPage';
import Notices from './pages/notice/Notices';
import NoticeDetail from './pages/notice/NoticeDetail';
import Freeboards from './pages/freeboard/Freeboards';
import FreeboardDetail from './pages/freeboard/FreeboardDetail';
import FreeboardWrite from './pages/freeboard/FreeboardWrite';
import AiChatBubble from './components/ai/AiChatBubble';
import WeatherWidget from './components/main/WeatherSection';

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
        <Route path="/companions/write" element={<PageTransition><CompanionWrite /></PageTransition>} />
        <Route path="/companions/:companionNo" element={<PageTransition><CompanionDetail /></PageTransition>} />
        <Route path="/reviews" element={<PageTransition><Reviews /></PageTransition>} />
        <Route path="/reviews/write" element={<PageTransition><ReviewWrite /></PageTransition>} />
        <Route path="/reviews/:reviewNo" element={<PageTransition><ReviewDetail /></PageTransition>} />
        <Route path="/freeboard" element={<PageTransition><Freeboards /></PageTransition>} />
        <Route path="/freeboard/write" element={<PageTransition><FreeboardWrite /></PageTransition>} />
        <Route path="/freeboard/:boardNo" element={<PageTransition><FreeboardDetail /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FaqPage /></PageTransition>} />
        <Route path="/notices" element={<PageTransition><Notices /></PageTransition>} />
        <Route path="/notices/:boardNo" element={<PageTransition><NoticeDetail /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
        <Route path="/error/500" element={<PageTransition><ServerError /></PageTransition>} />
        <Route path="/error/403" element={<PageTransition><Forbidden /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
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
            <WeatherWidget />
            <AiChatBubble />
          </div>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
