import React, { useContext, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import MyPage from './Mypage';
import {
  FiHome, FiEdit3, FiUsers, FiMapPin, FiStar, FiHeart,
  FiSearch, FiCalendar, FiUser, FiChevronRight, FiMenu,
  FiX, FiBell, FiBookmark, FiGrid, FiCoffee, FiSunrise,
  FiArrowRight
} from 'react-icons/fi';

/**
 * 메인 컴포넌트 - UI/UX 개선 버전
 */

function Main() {
  const { user, handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onLogout = () => {
    handleLogout();
    alert('로그아웃되었습니다.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Banner - 더 미니멀하게 */}
      <div className="bg-jeju-600 text-white text-center py-2 text-sm">
        <span className="opacity-80">첫 방문 회원 특별 혜택</span>
        <span className="mx-2">·</span>
        <span className="font-medium">지금 바로 확인하세요</span>
        <FiArrowRight className="inline ml-1 w-3 h-3" />
      </div>

      {/* Header - 더 깔끔하게 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-10">
              <h1
                onClick={() => navigate('/')}
                className="text-2xl font-black cursor-pointer tracking-tight"
              >
                <span className="text-jeju-600">혼</span>
                <span className="text-emerald-500">행</span>
              </h1>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {['숙소', '동행찾기', '여행후기', '맛집', '이벤트'].map((item, idx) => (
                  <a
                    key={item}
                    href="#"
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg
                      ${idx === 0 ? 'text-jeju-600 bg-jeju-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-1">
              <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <FiSearch className="w-5 h-5" />
              </button>
              <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <FiBell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="hidden sm:flex p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                <FiBookmark className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div className="hidden sm:flex items-center gap-2 ml-3 pl-4 border-l border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-jeju-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.memberNickname?.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.memberNickname}</span>
                <Link
                  to="/mypage"
                  className="ml-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  마이페이지
                </Link>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  로그아웃
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2.5 text-gray-500 hover:bg-gray-100 rounded-full ml-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 py-4 bg-white">
              <nav className="flex flex-col gap-1">
                {['숙소', '동행찾기', '여행후기', '맛집', '이벤트'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="px-4 py-3 text-gray-700 hover:text-jeju-600 font-medium hover:bg-gray-50 rounded-lg"
                  >
                    {item}
                  </a>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <Link to="/mypage" className="px-4 py-3 text-gray-700 font-medium block hover:bg-gray-50 rounded-lg">
                    마이페이지
                  </Link>
                  <button onClick={onLogout} className="px-4 py-3 text-gray-500 font-medium w-full text-left hover:bg-gray-50 rounded-lg">
                    로그아웃
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </main>

      {/* Footer - 더 심플하게 */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">서비스</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#" className="hover:text-jeju-600 transition-colors">숙소 예약</a></li>
                <li><a href="#" className="hover:text-jeju-600 transition-colors">동행 찾기</a></li>
                <li><a href="#" className="hover:text-jeju-600 transition-colors">여행 후기</a></li>
                <li><a href="#" className="hover:text-jeju-600 transition-colors">맛집 추천</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">고객지원</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#" className="hover:text-jeju-600 transition-colors">자주 묻는 질문</a></li>
                <li><a href="#" className="hover:text-jeju-600 transition-colors">1:1 문의</a></li>
                <li><a href="#" className="hover:text-jeju-600 transition-colors">공지사항</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">회사</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#" className="hover:text-jeju-600 transition-colors">회사 소개</a></li>
                <li><a href="#" className="hover:text-jeju-600 transition-colors">채용 정보</a></li>
                <li><a href="#" className="hover:text-jeju-600 transition-colors">제휴 문의</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-sm">약관</h4>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><a href="#" className="hover:text-jeju-600 transition-colors">이용약관</a></li>
                <li><a href="#" className="hover:text-jeju-600 transition-colors">개인정보처리방침</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xl font-black tracking-tight">
              <span className="text-jeju-600">혼</span>
              <span className="text-emerald-500">행</span>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 혼행. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 홈 페이지 - UI/UX 개선
function HomePage({ user }) {
  const categories = [
    { icon: FiHome, label: '게스트하우스' },
    { icon: FiUsers, label: '동행찾기' },
    { icon: FiEdit3, label: '여행후기' },
    { icon: FiCoffee, label: '맛집/카페' },
    { icon: FiSunrise, label: '액티비티' },
    { icon: FiGrid, label: '전체보기' },
  ];

  const popularAccom = [
    { name: '제주 올레 게스트하우스', location: '제주시 연동', rating: 4.9, reviews: 328, price: '35,000', tag: '인기' },
    { name: '서귀포 바다뷰 하우스', location: '서귀포시 중문', rating: 4.8, reviews: 256, price: '42,000', tag: null },
    { name: '한라산 힐링 스테이', location: '제주시 애월읍', rating: 4.9, reviews: 189, price: '55,000', tag: '추천' },
    { name: '협재 선셋 게하', location: '제주시 한림읍', rating: 4.7, reviews: 412, price: '38,000', tag: null },
  ];

  const companions = [
    { title: '1/25 성산일출봉 일출 보러 가실 분!', author: '여행조아', date: '오늘', members: '2/4', tag: '일출' },
    { title: '우도 자전거 투어 같이 해요~', author: '제주사랑', date: '어제', members: '3/4', tag: '액티비티' },
    { title: '한라산 백록담 등반 동행 구합니다', author: '등산마니아', date: '2일 전', members: '1/3', tag: '등산' },
  ];

  const reviews = [
    { title: '혼자 와도 외롭지 않았어요', content: '게스트하우스에서 좋은 사람들 만나서 같이 여행했어요. 정말 추천합니다!', author: '행복한나그네', likes: 234, image: 'bg-gradient-to-br from-sky-100 to-blue-200' },
    { title: '제주도 3박 4일 혼행 후기', content: '처음 혼자 여행인데 너무 좋았습니다. 다음에 또 올게요!', author: '솔로여행러', likes: 189, image: 'bg-gradient-to-br from-amber-100 to-orange-200' },
    { title: '애월 카페 투어 추천!', content: '애월 해안도로 카페들 정말 예뻐요. 사진 맛집입니다.', author: '카페덕후', likes: 156, image: 'bg-gradient-to-br from-emerald-100 to-teal-200' },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section - 더 세련되게 */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="text-center mb-10">
            <p className="text-jeju-600 font-medium text-sm mb-3">제주도 혼자 여행의 시작</p>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
              나만의 제주 여행,<br />
              <span className="text-jeju-600">어디서</span> 시작할까요?
            </h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              숙소 예약부터 동행 찾기까지, 혼행이 함께합니다
            </p>
          </div>

          {/* Search Box - 더 미니멀하게 */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 p-2">
              <div className="flex flex-col md:flex-row">
                {/* Location */}
                <div className="flex-1 p-3 md:p-4 border-b md:border-b-0 md:border-r border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FiMapPin className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-0.5">여행지</div>
                      <input
                        type="text"
                        placeholder="제주시, 서귀포시..."
                        className="w-full text-gray-900 font-medium placeholder-gray-300 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex-1 p-3 md:p-4 border-b md:border-b-0 md:border-r border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FiCalendar className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-0.5">일정</div>
                      <input
                        type="text"
                        placeholder="날짜 선택"
                        className="w-full text-gray-900 font-medium placeholder-gray-300 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="flex-1 p-3 md:p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FiUser className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-0.5">인원</div>
                      <input
                        type="text"
                        placeholder="1명"
                        className="w-full text-gray-900 font-medium placeholder-gray-300 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <button className="m-2 px-6 py-3 bg-jeju-600 hover:bg-jeju-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-jeju-600/25">
                  <FiSearch className="w-5 h-5" />
                  <span className="hidden sm:inline">검색</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - 더 심플하게 */}
      <section className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center gap-4 md:gap-8 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat, index) => (
              <button
                key={index}
                className="flex flex-col items-center gap-2.5 min-w-[72px] group"
              >
                <div className="w-14 h-14 bg-gray-100 group-hover:bg-jeju-50 rounded-2xl flex items-center justify-center text-gray-500 group-hover:text-jeju-600 transition-all group-hover:scale-105">
                  <cat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-600 group-hover:text-jeju-600 font-medium whitespace-nowrap transition-colors">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions - 카드 스타일 개선 */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 프로모션 1 */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-jeju-600 to-jeju-700 p-6 md:p-8 cursor-pointer hover:shadow-xl hover:shadow-jeju-600/20 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur rounded-lg text-xs font-semibold text-white mb-4">
                HOT
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">성수기 특가</h3>
              <p className="text-white/80 text-sm mb-4">제주 인기 숙소 최대 50% 할인</p>
              <span className="inline-flex items-center gap-1 text-white text-sm font-medium group-hover:gap-2 transition-all">
                자세히 보기 <FiArrowRight className="w-4 h-4" />
              </span>
            </div>

            {/* 프로모션 2 */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 md:p-8 cursor-pointer hover:shadow-xl hover:shadow-emerald-500/20 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur rounded-lg text-xs font-semibold text-white mb-4">
                NEW
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">첫 동행 이벤트</h3>
              <p className="text-white/80 text-sm mb-4">동행 첫 매칭 시 스타벅스 쿠폰 증정</p>
              <span className="inline-flex items-center gap-1 text-white text-sm font-medium group-hover:gap-2 transition-all">
                자세히 보기 <FiArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Accommodations - 카드 개선 */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">인기 숙소</h3>
              <p className="text-gray-500 text-sm mt-1">혼행러들이 선택한 베스트 숙소</p>
            </div>
            <a href="#" className="text-gray-500 hover:text-jeju-600 font-medium flex items-center gap-1 text-sm transition-colors">
              전체보기 <FiChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {popularAccom.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer hover:-translate-y-1"
              >
                {/* 이미지 영역 */}
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-jeju-100/50 to-emerald-100/50"></div>
                  {item.tag && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-jeju-600 rounded-lg">
                      {item.tag}
                    </span>
                  )}
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                    <FiHeart className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-jeju-600 transition-colors line-clamp-1 text-sm md:text-base">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">{item.location}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <FiStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-gray-900 text-sm">{item.rating}</span>
                    <span className="text-gray-400 text-xs">({item.reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-gray-900">{item.price}</span>
                    <span className="text-xs text-gray-400">원/박</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companions Section - 더 깔끔하게 */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">동행 찾기</h3>
              <p className="text-gray-500 text-sm mt-1">함께하면 더 즐거운 제주 여행</p>
            </div>
            <a href="#" className="text-gray-500 hover:text-jeju-600 font-medium flex items-center gap-1 text-sm transition-colors">
              전체보기 <FiChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {companions.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                    {item.tag}
                  </span>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-4 line-clamp-2 leading-snug">{item.title}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <FiUser className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500">{item.author}</span>
                  </div>
                  <span className="text-sm font-semibold text-jeju-600">{item.members}명</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section - 카드 디자인 개선 */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">여행 후기</h3>
              <p className="text-gray-500 text-sm mt-1">혼행러들의 생생한 제주 이야기</p>
            </div>
            <a href="#" className="text-gray-500 hover:text-jeju-600 font-medium flex items-center gap-1 text-sm transition-colors">
              전체보기 <FiChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {reviews.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 transition-all cursor-pointer"
              >
                {/* 이미지 영역 */}
                <div className={`aspect-[16/10] ${item.image} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-5">
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-jeju-600 transition-colors">{item.title}</h4>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{item.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <span className="text-sm text-gray-500">{item.author}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <FiHeart className="w-4 h-4" />
                      <span className="text-sm">{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner - 미니멀하게 */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-gray-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* 장식 요소 */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-jeju-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <p className="text-gray-400 text-sm mb-2">안녕하세요, {user.memberNickname}님</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                나만의 제주 여행을 시작해보세요
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                숙소 예약부터 현지인 추천 맛집까지, 혼행이 모든 것을 준비했습니다
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                  숙소 검색하기
                </button>
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors border border-white/10">
                  동행 찾기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Main;
