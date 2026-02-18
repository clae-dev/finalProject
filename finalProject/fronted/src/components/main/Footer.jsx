import React from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/logo/혼디.png';

const serviceLinks = [
  { name: '숙소', path: '/accommodations' },
  { name: '동행찾기', path: '/companions' },
  { name: '여행후기', path: '/reviews' },
  { name: '행사/액티비티', path: '/activities' },
  { name: '항공권', path: '/flights' },
];

const communityLinks = [
  { name: '자유게시판', path: '/freeboard' },
  { name: '공지사항', path: '/notices' },
  { name: '마이페이지', path: '/mypage' },
];

const supportLinks = [
  { name: '자주 묻는 질문', path: '/faq' },
  { name: '문의하기', path: '/inquiry' },
  { name: '이용약관', path: '/terms' },
  { name: '개인정보처리방침', path: '/privacy' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* 상단 웨이브 디바이더 */}
      <div className="bg-transparent leading-[0]">
        <svg className="block w-full h-12 sm:h-16" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path
            fill="#0f172a"
            d="M0,40 C300,10 600,50 900,25 C1100,10 1300,40 1440,20 L1440,60 L0,60 Z"
          />
        </svg>
      </div>

      <div className="bg-slate-900 -mt-px">
        {/* 장식 블러 원 */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-12">
          {/* 메인 컨텐츠 — 4컬럼 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
            {/* 브랜드 영역 */}
            <div className="lg:col-span-1">
              <Link to="/home" className="flex items-center gap-3 group mb-5">
                <img
                  src={logo}
                  alt="혼디"
                  className="h-12 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
                <div className="flex flex-col leading-tight">
                  <span
                    className="text-xl font-black bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent tracking-wider"
                    style={{ fontFamily: "'GmarketSans', sans-serif" }}
                  >
                    HONDI
                  </span>
                  <span
                    className="text-[10px] font-semibold text-slate-500 tracking-widest"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    혼디
                  </span>
                </div>
              </Link>
              <p
                className="text-sm text-slate-400 leading-relaxed mb-6"
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                제주 바다처럼 자유로운
                <br />
                혼자 여행자들의 커뮤니티
              </p>
              <div className="flex items-center gap-3 text-slate-500">
                <a href="mailto:hondi@hondi.com" className="hover:text-sky-400 transition-colors" aria-label="Email">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </a>
                <a href="#" className="hover:text-sky-400 transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={1.5} />
                    <circle cx="12" cy="12" r="5" strokeWidth={1.5} />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="#" className="hover:text-sky-400 transition-colors" aria-label="GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* 서비스 */}
            <div>
              <h4
                className="text-sm font-bold text-white mb-5 tracking-wide"
                style={{ fontFamily: "'GmarketSans', sans-serif" }}
              >
                서비스
              </h4>
              <ul className="space-y-3">
                {serviceLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-sm text-slate-400 hover:text-sky-400 transition-colors duration-300 font-medium"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 커뮤니티 */}
            <div>
              <h4
                className="text-sm font-bold text-white mb-5 tracking-wide"
                style={{ fontFamily: "'GmarketSans', sans-serif" }}
              >
                커뮤니티
              </h4>
              <ul className="space-y-3">
                {communityLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-sm text-slate-400 hover:text-sky-400 transition-colors duration-300 font-medium"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 고객지원 */}
            <div>
              <h4
                className="text-sm font-bold text-white mb-5 tracking-wide"
                style={{ fontFamily: "'GmarketSans', sans-serif" }}
              >
                고객지원
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-sm text-slate-400 hover:text-sky-400 transition-colors duration-300 font-medium"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 구분선 + 하단 */}
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p
              className="text-xs text-slate-500 font-medium"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              &copy; 2025 HONDI. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span style={{ fontFamily: "'Pretendard', sans-serif" }}>Made with</span>
              <span className="text-sky-400">&hearts;</span>
              <span style={{ fontFamily: "'Pretendard', sans-serif" }}>in Jeju</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
