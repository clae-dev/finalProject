import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Heart, Phone, Clock, Loader2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { useAccommodations } from '../../api/accommodation/useAccommodation';
import heroImg1 from '../../assets/images/accommodation/월정리.png';
import heroImg2 from '../../assets/images/accommodation/협재2.png';

const heroSlides = [heroImg1, heroImg2];


const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};


export default function Accommodations() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    region: 'all',
    priceRange: 'all'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [heroSlide, setHeroSlide] = useState(0);
  const pageSize = 9;

  // 히어로 슬라이드쇼
  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // 지역 파라미터 변환
  const regionParam = filters.region === 'all' ? null :
                      filters.region === 'jeju_city' ? '제주시' : '서귀포시';

  // 1차: totalCount 확인용 조회
  const { data, isLoading, isError, error, refetch } = useAccommodations(1, 10000, regionParam);

  const accommodations = data?.success ? (data.list || []) : [];
  const totalCount = data?.success ? (data.totalCount || 0) : 0;
  const errorMessage = isError ? '서버와 연결할 수 없습니다.' : (data && !data.success ? (data.message || '게스트하우스 목록을 불러오는데 실패했습니다.') : null);

  // 지역 필터 변경 시 페이지 초기화
  const handleRegionChange = (value) => {
    setFilters({...filters, region: value});
    setCurrentPage(1);
  };

  // 프론트엔드 필터링 (검색어, 가격대)
  const filteredAccommodations = accommodations.filter(acc => {
    // 검색어 필터
    const matchesSearch = !searchTerm ||
      acc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.recommendationReason?.toLowerCase().includes(searchTerm.toLowerCase());

    // 가격대 필터
    let matchesPriceRange = true;
    if (filters.priceRange !== 'all' && acc.priceMin) {
      const price = acc.priceMin;
      matchesPriceRange =
        filters.priceRange === '10k-30k' ? price >= 10000 && price < 30000 :
        filters.priceRange === '30k-50k' ? price >= 30000 && price < 50000 :
        filters.priceRange === '50k-100k' ? price >= 50000 && price < 100000 :
        filters.priceRange === '100k+' ? price >= 100000 : true;
    }

    return matchesSearch && matchesPriceRange;
  });

  // 가격 포맷
  const formatPrice = (priceMin, priceMax) => {
    if (!priceMin && !priceMax) return '가격 문의';
    if (priceMin && priceMax) {
      return `${(priceMin / 10000).toFixed(0)}~${(priceMax / 10000).toFixed(0)}만원`;
    }
    if (priceMin) return `${(priceMin / 10000).toFixed(0)}만원~`;
    return `~${(priceMax / 10000).toFixed(0)}만원`;
  };

  // 편의시설 파싱
  const parseFacilities = (facilities) => {
    if (!facilities) return [];
    return facilities.split(',').map(f => f.trim()).filter(f => f);
  };

  // 기본 이미지
  const defaultImage = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600';

  // 프론트엔드 페이지네이션
  const totalFilteredCount = filteredAccommodations.length;
  const totalPages = Math.ceil(totalFilteredCount / pageSize);
  const paginatedAccommodations = filteredAccommodations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      {/* 히어로 섹션 */}
      <div className="relative h-[480px] overflow-hidden">
        {heroSlides.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-[1500ms] ${heroSlide === idx ? 'opacity-100' : 'opacity-0'}`}>
            <motion.img
              src={img}
              alt="제주 게스트하우스"
              className="w-full h-full object-cover object-[center_40%]"
              animate={{ scale: heroSlide === idx ? 1.05 : 1 }}
              transition={{ duration: 8, ease: 'linear' }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-cyan-900/20 to-slate-900/70" />

        {/* 배경 장식 */}
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
            Jeju Guesthouse
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-cyan-100 shadow-lg shadow-cyan-500/10"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span style={{ fontFamily: "'Pretendard', sans-serif" }}>혼행 추천 게스트하우스</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl font-black mb-6 text-center leading-tight drop-shadow-lg"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            <span className="text-white">제주, 나를 찾는 </span>
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">여행</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-white/70 text-center max-w-md leading-relaxed"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            바다 소리에 귀 기울이고, 바람에 마음을 맡기는<br />
            당신만의 특별한 시간
          </motion.p>
        </div>

        {/* 슬라이드 인디케이터 */}
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

      {/* 필터 섹션 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-sky-100 sticky top-16 z-40 shadow-sm shadow-sky-100/30">
        <div className="max-w-6xl mx-auto px-5 py-5">
          {/* 검색바 */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
            <Input
              placeholder="게스트하우스명, 주소로 검색..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-12 h-12 bg-sky-50/50 border-sky-100 focus:border-sky-400 rounded-2xl shadow-sm focus:shadow-md transition-shadow"
            />
          </div>

          {/* 지역 / 가격 드롭다운 */}
          <div className="grid grid-cols-2 gap-3">
            <Select value={filters.region} onValueChange={handleRegionChange}>
              <SelectTrigger className="h-10 bg-white border-sky-100 rounded-xl hover:border-sky-200 transition-colors">
                <SelectValue placeholder="전체 지역" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 지역</SelectItem>
                <SelectItem value="jeju_city">제주시</SelectItem>
                <SelectItem value="seogwipo">서귀포시</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priceRange} onValueChange={(value) => { setFilters({...filters, priceRange: value}); setCurrentPage(1); }}>
              <SelectTrigger className="h-10 bg-white border-sky-100 rounded-xl hover:border-sky-200 transition-colors">
                <SelectValue placeholder="가격대" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 가격</SelectItem>
                <SelectItem value="10k-30k">1만~3만원</SelectItem>
                <SelectItem value="30k-50k">3만~5만원</SelectItem>
                <SelectItem value="50k-100k">5만~10만원</SelectItem>
                <SelectItem value="100k+">10만원+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 숙소 목록 */}
      <div className="relative max-w-6xl mx-auto px-5 py-12">
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-100/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-40 left-0 w-60 h-60 bg-sky-100/40 rounded-full blur-3xl -z-10" />

        {/* 결과 카운트 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
            <span className="text-slate-800">여행자에게 추천하는 </span>
            <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 bg-clip-text text-transparent">게스트하우스</span>
          </h2>
          <p className="text-slate-400 text-sm">
            총 <span className="font-bold text-sky-500">{totalCount}</span>개의 게스트하우스
            {totalFilteredCount !== totalCount &&
              ` (필터 적용: ${totalFilteredCount}개)`
            }
          </p>
        </motion.div>

        {/* 로딩 상태 */}
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
            <p className="text-slate-400 text-sm font-medium">게스트하우스를 찾고 있어요...</p>
          </motion.div>
        )}

        {/* 에러 상태 */}
        {errorMessage && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <p className="text-rose-500 text-lg mb-4 font-semibold">{errorMessage}</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => refetch()}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-200/50 hover:shadow-xl transition-shadow"
            >
              다시 시도
            </motion.button>
          </motion.div>
        )}

        {/* 숙소 카드 그리드 */}
        {!isLoading && !errorMessage && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${filters.region}-${filters.priceRange}-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-7"
              >
                {paginatedAccommodations.map((acc, index) => (
                  <motion.div
                    key={acc.accommodationNo}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    onClick={() => navigate(`/accommodations/${acc.accommodationNo}`)}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-sky-100/50 hover:shadow-2xl hover:shadow-sky-200/60 transition-shadow duration-300 cursor-pointer group border border-sky-50"
                  >
                    {/* 이미지 */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={acc.thumbnailUrl || defaultImage}
                        alt={acc.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.target.src = defaultImage; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/5 to-transparent" />

                      {/* 찜 버튼 */}
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      >
                        <Heart className="w-4.5 h-4.5 text-slate-400 hover:text-rose-500 transition-colors" />
                      </button>

                      {/* 숙소 유형 배지 */}
                      {acc.accommodationType && (
                        <span className="absolute top-4 left-4 px-3.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-sky-500 shadow-lg">
                          {acc.accommodationType}
                        </span>
                      )}

                      {/* 가격 */}
                      <div className="absolute bottom-4 right-4">
                        <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-sm font-bold text-sky-600 shadow-lg">
                          {formatPrice(acc.priceMin, acc.priceMax)}
                        </span>
                      </div>
                    </div>

                    {/* 카드 내용 */}
                    <div className="p-5">
                      <h3 className="font-bold text-slate-800 text-lg mb-3 line-clamp-1 group-hover:text-sky-600 transition-colors duration-300">
                        {acc.name}
                      </h3>

                      <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-sky-400" />
                        <span className="line-clamp-1">{acc.address || acc.region}</span>
                      </div>

                      {acc.phone && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-2">
                          <Phone className="w-3.5 h-3.5 flex-shrink-0 text-sky-400" />
                          <span>{acc.phone}</span>
                        </div>
                      )}

                      {(acc.checkInTime || acc.checkOutTime) && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-2">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0 text-sky-400" />
                          <span>
                            {acc.checkInTime && `입실 ${acc.checkInTime}`}
                            {acc.checkInTime && acc.checkOutTime && ' / '}
                            {acc.checkOutTime && `퇴실 ${acc.checkOutTime}`}
                          </span>
                        </div>
                      )}

                      {acc.recommendationReason && (
                        <p className="text-slate-500 text-sm mb-3 line-clamp-2 leading-relaxed">{acc.recommendationReason}</p>
                      )}

                      {/* 편의시설 */}
                      {acc.facilities && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {parseFacilities(acc.facilities).slice(0, 3).map((facility, idx) => (
                            <span key={idx} className="text-xs bg-sky-50 text-sky-600 px-2.5 py-1 rounded-full font-medium">
                              {facility}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-sky-50">
                        <span className="text-xs text-slate-400 font-medium">{acc.region}</span>
                        <span className="text-sm font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
                          {formatPrice(acc.priceMin, acc.priceMax)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* 빈 상태 */}
            {totalFilteredCount === 0 && !isLoading && (
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
                <h3 className="text-xl font-bold text-slate-700 mb-3">검색 결과가 없습니다</h3>
                <p className="text-slate-400">다른 조건으로 검색해보세요</p>
              </motion.div>
            )}

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
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
