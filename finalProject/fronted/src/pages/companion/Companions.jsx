import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, ChevronLeft, ChevronRight, Loader2, Search, Sparkles } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { useCompanions } from '../../api/companion/useCompanion';
import { AuthContext } from '../../components/AuthContext';
import heroStar from '../../assets/images/companion/별.png';
import heroFriends from '../../assets/images/companion/친구.png';

const heroSlides = [heroStar, heroFriends];

const TAGS = ['전체', '우도', '카페', '트레킹', '맛집', '일출', '올레길', '자전거', '서핑'];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400';

function getDday(travelDate) {
  if (!travelDate) return null;
  let target;
  const isoMatch = travelDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    target = new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
  } else {
    const match = travelDate.match(/(\d{1,2})\.(\d{1,2})/);
    if (!match) return null;
    const now = new Date();
    const year = now.getFullYear();
    target = new Date(year, parseInt(match[1]) - 1, parseInt(match[2]));
    if (target < now) target.setFullYear(year + 1);
  }
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'D-Day';
  if (diff > 0) return `D-${diff}`;
  return null;
}

function formatTravelDate(travelDate) {
  if (!travelDate) return '';
  const isoMatch = travelDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const d = new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
    return `${d.getMonth() + 1}.${d.getDate()}(${days[d.getDay()]})`;
  }
  return travelDate;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const tagVariants = {
  inactive: { scale: 1 },
  active: { scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 15 } },
};

export default function Companions() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const [selectedTag, setSelectedTag] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [heroSlide, setHeroSlide] = useState(0);
  const pageSize = 9;

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading } = useCompanions(currentPage, pageSize, selectedTag);

  const companions = data?.success ? (data.list || []) : [];
  const totalCount = data?.success ? (data.totalCount || 0) : 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      {/* 히어로 */}
      <div className="relative h-[480px] overflow-hidden">
        {heroSlides.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-[1500ms] ${heroSlide === idx ? 'opacity-100' : 'opacity-0'}`}>
            <motion.img
              src={img} alt=""
              className="w-full h-full object-cover"
              animate={{ scale: heroSlide === idx ? 1.05 : 1 }}
              transition={{ duration: 8, ease: 'linear' }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-cyan-900/20 to-slate-900/70" />

        {/* 장식 요소 */}
        <motion.div
          className="absolute top-20 left-[10%] w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-[10%] w-40 h-40 bg-sky-400/20 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/50 text-sm tracking-[0.3em] uppercase mb-5"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            Jeju Companion
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-cyan-100 shadow-lg shadow-cyan-500/10"
          >
            <Users className="w-4 h-4 text-cyan-300" />
            <span style={{ fontFamily: "'Pretendard', sans-serif" }}>제주 동행 찾기</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl font-black mb-6 text-center leading-tight drop-shadow-lg"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            <span className="text-white">함께라서 더 특별한 </span>
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">제주</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-white/70 text-center max-w-md leading-relaxed"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            혼자여도 괜찮아요. 같은 길을 걷는 동행을 만나보세요.
          </motion.p>
        </div>

        {/* 인디케이터 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${heroSlide === idx ? 'w-10 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>

        {/* 하단 웨이브 */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(240 249 255)" d="M0,50 C300,80 600,20 900,50 C1100,70 1300,30 1440,45 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="relative max-w-6xl mx-auto px-5 py-12">
        {/* 장식 */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-100/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-40 left-0 w-60 h-60 bg-sky-100/40 rounded-full blur-3xl -z-10" />

        {/* 태그 필터 + 작성 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-10"
        >
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <motion.button
                key={tag}
                onClick={() => handleTagChange(tag)}
                variants={tagVariants}
                animate={selectedTag === tag ? 'active' : 'inactive'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedTag === tag
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200/60'
                    : 'bg-white text-slate-500 hover:text-sky-600 shadow-sm border border-sky-100 hover:border-sky-200 hover:shadow-md'
                }`}
              >
                {tag === '전체' ? tag : `#${tag}`}
              </motion.button>
            ))}
          </div>
          {user && (
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/companions/write')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-sky-200/50 transition-shadow"
            >
              <Plus className="w-4 h-4" />
              모집글 작성
            </motion.button>
          )}
        </motion.div>

        {/* 로딩 */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-10 h-10 text-sky-400" />
            </motion.div>
            <p className="text-slate-400 text-sm font-medium">동행을 찾고 있어요...</p>
          </motion.div>
        )}

        {/* 빈 상태 */}
        {!isLoading && companions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-24"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-24 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-100"
            >
              <Search className="w-12 h-12 text-sky-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-slate-700 mb-3">아직 모집글이 없습니다</h3>
            <p className="text-slate-400 mb-6">첫 번째 동행 모집글을 작성해보세요!</p>
            {user && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/companions/write')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-200"
              >
                <Plus className="w-4 h-4" />
                첫 모집글 작성하기
              </motion.button>
            )}
          </motion.div>
        )}

        {/* 카드 그리드 */}
        <AnimatePresence mode="wait">
          {!isLoading && companions.length > 0 && (
            <motion.div
              key={`${selectedTag}-${currentPage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              {companions.map((comp, index) => {
                const dday = getDday(comp.travelDate);
                const tagList = comp.tags ? comp.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

                return (
                  <motion.div
                    key={comp.companionNo}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    onClick={() => navigate(`/companions/${comp.companionNo}`)}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-sky-100/50 hover:shadow-2xl hover:shadow-sky-200/60 transition-shadow duration-300 cursor-pointer group border border-sky-50"
                  >
                    {/* 이미지 */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={comp.imageUrl || DEFAULT_IMAGE}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />

                      {/* D-day 배지 */}
                      {dday && (
                        <span className="absolute top-4 right-4 px-3.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-sky-500 shadow-lg">
                          {dday}
                        </span>
                      )}

                      {/* 마감 배지 */}
                      {comp.status === 'C' && (
                        <span className="absolute top-4 left-4 px-3.5 py-1.5 bg-red-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg">
                          마감
                        </span>
                      )}

                      {/* 태그 */}
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        {tagList.slice(0, 3).map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-600 shadow-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 카드 내용 */}
                    <div className="p-5">
                      <h3 className="font-bold text-slate-800 text-lg mb-4 line-clamp-1 group-hover:text-sky-600 transition-colors duration-300">{comp.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-sky-200/50 overflow-hidden">
                            {comp.authorProfile ? (
                              <img src={comp.authorProfile} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = comp.authorNickname?.[0] || '?'; }} />
                            ) : (
                              comp.authorNickname?.[0] || '?'
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">{comp.authorNickname || '익명'}</p>
                            <p className="text-xs text-slate-400">{comp.authorAgeRange || ''}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">{comp.currentMembers}/{comp.maxMembers}</p>
                          <p className="text-xs text-slate-400">{formatTravelDate(comp.travelDate)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center justify-center gap-2 mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-11 h-11 rounded-xl bg-white shadow-md shadow-sky-100 flex items-center justify-center text-slate-400 hover:text-sky-500 hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-sky-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .map((page, idx, arr) => (
                <React.Fragment key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="text-slate-300 px-1">...</span>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentPage(page)}
                    className={`w-11 h-11 rounded-xl font-bold text-sm transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200/60'
                        : 'bg-white shadow-md shadow-sky-50 text-slate-500 hover:text-sky-500 border border-sky-50'
                    }`}
                  >
                    {page}
                  </motion.button>
                </React.Fragment>
              ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-11 h-11 rounded-xl bg-white shadow-md shadow-sky-100 flex items-center justify-center text-slate-400 hover:text-sky-500 hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-sky-50"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
