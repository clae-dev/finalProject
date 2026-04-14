/**
 * HONDI 앱 루트 컴포넌트 - 라우팅 설정 및 전역 Provider 구성
 */
import { lazy, Suspense } from 'react';
import { AuthProvider } from './components/AuthContext';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from './lib/query-client';
// DevTools는 개발 환경에서만 동적 로드 → 프로덕션 번들에서 완전 제거
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() => import('@tanstack/react-query-devtools').then(m => ({ default: m.ReactQueryDevtools })))
  : null;
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/common/PageTransition';
const ChatBubble    = lazy(() => import('./components/chatting/ChatBubble'));
const AiChatBubble  = lazy(() => import('./components/ai/AiChatBubble'));
const WeatherWidget = lazy(() => import('./components/main/WeatherSection'));

// 페이지 컴포넌트 - 라우트 진입 시점에만 번들 로드
const Main = lazy(() => import('./components/Main'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const FindPassword = lazy(() => import('./components/FindPassword'));
const OAuthCallback = lazy(() => import('./components/OAuthCallback'));
const MyPage = lazy(() => import('./components/Mypage'));
const Accommodations = lazy(() => import('./pages/accommodation/Accommodations'));
const AccommodationDetail = lazy(() => import('./pages/accommodation/AccommodationDetail'));
const AccommodationReviewWrite = lazy(() => import('./pages/accommodation/AccommodationReviewWrite'));
const Companions = lazy(() => import('./pages/companion/Companions'));
const CompanionWrite = lazy(() => import('./pages/companion/CompanionWrite'));
const CompanionDetail = lazy(() => import('./pages/companion/CompanionDetail'));
const CompanionEdit = lazy(() => import('./pages/companion/CompanionEdit'));
const Reviews = lazy(() => import('./pages/review/Reviews'));
const ReviewWrite = lazy(() => import('./pages/review/ReviewWrite'));
const ReviewDetail = lazy(() => import('./pages/review/ReviewDetail'));
const Freeboards = lazy(() => import('./pages/freeboard/Freeboards'));
const FreeboardWrite = lazy(() => import('./pages/freeboard/FreeboardWrite'));
const FreeboardDetail = lazy(() => import('./pages/freeboard/FreeboardDetail'));
const Activities = lazy(() => import('./pages/activity/Activities'));
const ActivityDetail = lazy(() => import('./pages/activity/ActivityDetail'));
const ActivityWrite = lazy(() => import('./pages/activity/ActivityWrite'));
const Flights = lazy(() => import('./pages/flight/Flights'));
const FaqPage = lazy(() => import('./pages/faq/FaqPage'));
const Notices = lazy(() => import('./pages/notice/Notices'));
const NoticeDetail = lazy(() => import('./pages/notice/NoticeDetail'));
const PrivacyPolicy = lazy(() => import('./pages/privacy/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/terms/TermsOfService'));
const InquiryPage = lazy(() => import('./pages/inquiry/InquiryPage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const OlleTrails = lazy(() => import('./pages/olle/OlleTrails'));
const OlleDetail = lazy(() => import('./pages/olle/OlleDetail'));
const NotFound = lazy(() => import('./pages/error/NotFound'));
const ServerError = lazy(() => import('./pages/error/ServerError'));
const Forbidden = lazy(() => import('./pages/error/Forbidden'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={null}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Main /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          <Route path="/find-password" element={<PageTransition><FindPassword /></PageTransition>} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/accommodations" element={<PageTransition><Accommodations /></PageTransition>} />
          <Route path="/accommodations/:accommodationNo" element={<PageTransition><AccommodationDetail /></PageTransition>} />
          <Route path="/accommodations/:accommodationNo/review/write" element={<PageTransition><AccommodationReviewWrite /></PageTransition>} />
          <Route path="/mypage" element={<PageTransition><MyPage /></PageTransition>} />
          <Route path="/companions" element={<PageTransition><Companions /></PageTransition>} />
          <Route path="/companions/write" element={<PageTransition><CompanionWrite /></PageTransition>} />
          <Route path="/companions/:companionNo" element={<PageTransition><CompanionDetail /></PageTransition>} />
          <Route path="/companions/:companionNo/edit" element={<PageTransition><CompanionEdit /></PageTransition>} />
          <Route path="/reviews" element={<PageTransition><Reviews /></PageTransition>} />
          <Route path="/reviews/write" element={<PageTransition><ReviewWrite /></PageTransition>} />
          <Route path="/reviews/:reviewNo" element={<PageTransition><ReviewDetail /></PageTransition>} />
          <Route path="/freeboard" element={<PageTransition><Freeboards /></PageTransition>} />
          <Route path="/freeboard/write" element={<PageTransition><FreeboardWrite /></PageTransition>} />
          <Route path="/freeboard/:boardNo" element={<PageTransition><FreeboardDetail /></PageTransition>} />
          <Route path="/activities" element={<PageTransition><Activities /></PageTransition>} />
          <Route path="/flights" element={<PageTransition><Flights /></PageTransition>} />
          <Route path="/activities/write" element={<PageTransition><ActivityWrite /></PageTransition>} />
          <Route path="/activities/:boardNo" element={<PageTransition><ActivityDetail /></PageTransition>} />
          <Route path="/faq" element={<PageTransition><FaqPage /></PageTransition>} />
          <Route path="/notices" element={<PageTransition><Notices /></PageTransition>} />
          <Route path="/notices/:boardNo" element={<PageTransition><NoticeDetail /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
          <Route path="/inquiry" element={<PageTransition><InquiryPage /></PageTransition>} />
          <Route path="/olle" element={<PageTransition><OlleTrails /></PageTransition>} />
          <Route path="/olle/:courseNo" element={<PageTransition><OlleDetail /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
          <Route path="/error/500" element={<PageTransition><ServerError /></PageTransition>} />
          <Route path="/error/403" element={<PageTransition><Forbidden /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

/** 관리자 페이지에서는 날씨·AI 위젯 숨김, 1:1 채팅은 유지
 *  조건부 렌더 대신 CSS hidden으로 처리하여 unmount/remount 비용 제거 */
function GlobalWidgets() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <Suspense fallback={null}>
      <div className={isAdmin ? 'hidden' : ''}>
        <WeatherWidget />
        <AiChatBubble />
      </div>
      <ChatBubble />
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-b from-sky-50 to-cyan-50">
            <AnimatedRoutes />
            <GlobalWidgets />
          </div>
        </BrowserRouter>
      </AuthProvider>
      {import.meta.env.DEV && ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;
