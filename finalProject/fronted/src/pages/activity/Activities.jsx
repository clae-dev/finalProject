import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Search, Eye, Heart, MessageCircle, ChevronLeft, ChevronRight, Loader2, PenLine, ImageIcon, MapPin, Phone, Bike } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { useActivityList, useEventList, useLeisureList } from '../../api/activity/useActivity';
import { AuthContext } from '../../components/AuthContext';
import heroImg1 from '../../assets/images/Activity/KakaoTalk_20260226_135519289.webp';
import heroImg2 from '../../assets/images/Activity/KakaoTalk_20260226_135519289_01.webp';
import heroImg3 from '../../assets/images/Activity/KakaoTalk_20260226_135519289_02.webp';
import heroImg4 from '../../assets/images/Activity/KakaoTalk_20260226_135519289_03.webp';

const heroSlides = [heroImg1, heroImg2, heroImg3, heroImg4];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400';

// 날짜 포맷 (YYYYMMDD → YYYY.MM.DD)
const formatDate = (dateStr) => {
  if (!dateStr || dateStr.length !== 8) return dateStr || '';
  return `${dateStr.slice(0, 4)}.${dateStr.slice(4, 6)}.${dateStr.slice(6, 8)}`;
};

export default function Activities() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'leisure' | 'community'

  // 공공 행사 상태
  const [eventPage, setEventPage] = useState(1);
  // 액티비티 상태
  const [leisurePage, setLeisurePage] = useState(1);
  // 커뮤니티 상태
  const [communityPage, setCommunityPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [heroSlide, setHeroSlide] = useState(0);
  const size = 9;

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const { data: eventData, isLoading: eventLoading } = useEventList(eventPage, size);
  const { data: leisureData, isLoading: leisureLoading } = useLeisureList(leisurePage, size);
  const { data: communityData, isLoading: communityLoading } = useActivityList(communityPage, size, search);

  // 공공 행사 데이터
  const eventList = eventData?.success ? (eventData.list || []) : [];
  const eventTotalCount = eventData?.success ? (eventData.totalCount || 0) : 0;
  const eventTotalPages = Math.ceil(eventTotalCount / size);
  const needApiKey = eventData?.needApiKey === true;

  // 액티비티 데이터
  const leisureList = leisureData?.success ? (leisureData.list || []) : [];
  const leisureTotalCount = leisureData?.success ? (leisureData.totalCount || 0) : 0;
  const leisureTotalPages = Math.ceil(leisureTotalCount / size);

  // 커뮤니티 데이터
  const communityList = communityData?.success ? (communityData.list || []) : [];
  const communityTotalCount = communityData?.success ? (communityData.totalCount || 0) : 0;
  const communityTotalPages = Math.ceil(communityTotalCount / size);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setCommunityPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50">
      <Header />

      {/* 히어로 배너 */}
      <div className="relative h-[480px] overflow-hidden mt-8">
        {heroSlides.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-[1500ms] ${heroSlide === idx ? 'opacity-100' : 'opacity-0'}`}>
            <motion.img
              src={img} alt=""
              className="w-full h-full object-cover object-[center_40%]"
              animate={{ scale: heroSlide === idx ? 1.05 : 1 }}
              transition={{ duration: 8, ease: 'linear' }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/50" />

        <motion.div
          className="absolute top-20 left-[10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-[10%] w-56 h-56 bg-amber-300/10 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/50 text-sm tracking-[0.3em] uppercase mb-5 font-pretendard"
          >
            Events & Activities
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-orange-100 shadow-lg shadow-orange-500/10"
          >
            <CalendarDays className="w-4 h-4 text-orange-300" />
            <span className="font-pretendard">행사/액티비티</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl font-black mb-6 text-center leading-tight drop-shadow-lg font-gmarket"
          >
            <span className="text-white">제주의 다채로운 </span>
            <span className="bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-300 bg-clip-text text-transparent">행사와 액티비티</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-white/70 text-center max-w-md leading-relaxed font-pretendard"
          >
            제주에서 열리는 축제, 이벤트, 체험활동을 확인하세요
          </motion.p>
        </div>

        {/* 인디케이터 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, idx) => (
            <button key={idx} onClick={() => setHeroSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${heroSlide === idx ? 'w-10 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>

        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(255 251 235)" d="M0,50 C300,80 600,20 900,50 C1100,70 1300,30 1440,45 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-12">
        {/* 탭 UI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-8"
        >
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200/60'
                : 'bg-white/80 text-slate-500 hover:text-orange-500 shadow-md shadow-orange-50 border border-orange-50'
            }`}
            className="font-pretendard"
          >
            공공 행사
          </button>
          <button
            onClick={() => setActiveTab('leisure')}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
              activeTab === 'leisure'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200/60'
                : 'bg-white/80 text-slate-500 hover:text-orange-500 shadow-md shadow-orange-50 border border-orange-50'
            }`}
            className="font-pretendard"
          >
            액티비티
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
              activeTab === 'community'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200/60'
                : 'bg-white/80 text-slate-500 hover:text-orange-500 shadow-md shadow-orange-50 border border-orange-50'
            }`}
            className="font-pretendard"
          >
            커뮤니티
          </button>
        </motion.div>

        {/* 커뮤니티 탭: 검색바 + 글쓰기 */}
        {activeTab === 'community' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-8"
          >
            <form onSubmit={handleSearch} className="flex-1 w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-orange-100 border border-orange-50 p-4 flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="행사명이나 내용으로 검색"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-orange-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 font-pretendard"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-orange-400 to-amber-400 text-white text-sm font-bold rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 font-pretendard"
              >
                검색
              </button>
            </form>

            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/activities/write')}
                className="inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-white font-bold rounded-2xl shadow-lg shadow-orange-200/50 hover:shadow-xl transition-all whitespace-nowrap font-pretendard"
              >
                <PenLine className="w-4 h-4" />
                행사 등록
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ======= 공공 행사 탭 ======= */}
        {activeTab === 'events' && (
          <>
            {eventLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 className="w-10 h-10 text-orange-400" />
                </motion.div>
              </div>
            ) : needApiKey ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <CalendarDays className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg font-medium mb-2 font-pretendard">
                  API 키 설정이 필요합니다
                </p>
                <p className="text-slate-400 text-sm font-pretendard">
                  config.properties에 한국관광공사 TourAPI 서비스 키를 설정해주세요
                </p>
              </motion.div>
            ) : eventList.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <CalendarDays className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 text-lg font-medium font-pretendard">
                  현재 진행 중인 공공 행사가 없습니다.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {eventList.map((event, index) => (
                  <motion.div
                    key={event.contentId || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-md shadow-orange-100/40 border border-orange-50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {/* 썸네일 */}
                    <div className="relative h-44 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <ImageIcon className="w-10 h-10 text-orange-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                      {/* 공공행사 뱃지 */}
                      <div className="absolute top-3 left-3">
                        <span
                          className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full font-pretendard"
                        >
                          공공행사
                        </span>
                      </div>
                    </div>

                    {/* 카드 내용 */}
                    <div className="p-5">
                      <h3
                        className="font-bold text-slate-800 text-base mb-3 line-clamp-1 group-hover:text-orange-600 transition-colors font-pretendard"
                      >
                        {event.title}
                      </h3>

                      {/* 기간 */}
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarDays className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                        <p className="text-sm text-slate-500 font-pretendard">
                          {formatDate(String(event.startDate))} ~ {formatDate(String(event.endDate))}
                        </p>
                      </div>

                      {/* 장소 */}
                      {event.addr && (
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                          <p className="text-sm text-slate-400 line-clamp-1 font-pretendard">
                            {event.addr}
                          </p>
                        </div>
                      )}

                      {/* 전화번호 */}
                      {event.tel && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                          <p className="text-sm text-slate-400 line-clamp-1 font-pretendard">
                            {event.tel}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 공공 행사 페이지네이션 */}
            {eventTotalPages > 1 && (
              <Pagination page={eventPage} totalPages={eventTotalPages} setPage={setEventPage} />
            )}
          </>
        )}

        {/* ======= 액티비티 탭 ======= */}
        {activeTab === 'leisure' && (
          <>
            {leisureLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 className="w-10 h-10 text-orange-400" />
                </motion.div>
              </div>
            ) : leisureList.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Bike className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 text-lg font-medium font-pretendard">
                  등록된 액티비티가 없습니다.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {leisureList.map((item, index) => (
                  <motion.div
                    key={item.contentId || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-md shadow-orange-100/40 border border-orange-50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="relative h-44 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <ImageIcon className="w-10 h-10 text-orange-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full font-pretendard"
                        >
                          <Bike className="w-3 h-3" />
                          액티비티
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3
                        className="font-bold text-slate-800 text-base mb-3 line-clamp-1 group-hover:text-orange-600 transition-colors font-pretendard"
                      >
                        {item.title}
                      </h3>

                      {item.addr && (
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                          <p className="text-sm text-slate-400 line-clamp-1 font-pretendard">
                            {item.addr}
                          </p>
                        </div>
                      )}

                      {item.tel && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                          <p className="text-sm text-slate-400 line-clamp-1 font-pretendard">
                            {item.tel}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {leisureTotalPages > 1 && (
              <Pagination page={leisurePage} totalPages={leisureTotalPages} setPage={setLeisurePage} />
            )}
          </>
        )}

        {/* ======= 커뮤니티 탭 ======= */}
        {activeTab === 'community' && (
          <>
            {communityLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 className="w-10 h-10 text-orange-400" />
                </motion.div>
              </div>
            ) : communityList.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <CalendarDays className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 text-lg font-medium font-pretendard">
                  등록된 행사가 없습니다.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {communityList.map((board, index) => (
                  <motion.div
                    key={board.boardNo}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/activities/${board.boardNo}`)}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-md shadow-orange-100/40 border border-orange-50 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {/* 썸네일 */}
                    <div className="relative h-44 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                      {board.imageUrls ? (
                        <img
                          src={board.imageUrls}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <ImageIcon className="w-10 h-10 text-orange-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                    </div>

                    {/* 카드 내용 */}
                    <div className="p-5">
                      <h3
                        className="font-bold text-slate-800 text-base mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors font-pretendard"
                      >
                        {board.boardTitle}
                      </h3>
                      <p
                        className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed font-pretendard"
                      >
                        {board.boardContent}
                      </p>

                      {/* 작성자 + 메타 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden">
                            {board.memberProfile ? (
                              <img src={board.memberProfile} alt="" loading="lazy" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = board.memberNickname?.[0] || '?'; }} />
                            ) : (
                              board.memberNickname?.[0] || '?'
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-600">{board.memberNickname}</p>
                            <p className="text-[10px] text-slate-400">{board.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {board.readCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            {board.commentCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            {board.likeCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 커뮤니티 페이지네이션 */}
            {communityTotalPages > 1 && (
              <Pagination page={communityPage} totalPages={communityTotalPages} setPage={setCommunityPage} />
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

/** 공통 페이지네이션 컴포넌트 */
function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setPage(p => Math.max(1, p - 1))}
        disabled={page === 1}
        className="w-11 h-11 rounded-xl bg-white shadow-md shadow-orange-100 flex items-center justify-center text-slate-400 hover:text-orange-500 hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-orange-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
        .map((p, idx, arr) => (
          <React.Fragment key={p}>
            {idx > 0 && arr[idx - 1] !== p - 1 && (
              <span className="text-slate-300 px-1">...</span>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setPage(p)}
              className={`w-11 h-11 rounded-xl font-bold text-sm transition-all duration-300 ${
                page === p
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200/60'
                  : 'bg-white shadow-md shadow-orange-50 text-slate-500 hover:text-orange-500 border border-orange-50'
              }`}
            >
              {p}
            </motion.button>
          </React.Fragment>
        ))}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className="w-11 h-11 rounded-xl bg-white shadow-md shadow-orange-100 flex items-center justify-center text-slate-400 hover:text-orange-500 hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-orange-50"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
