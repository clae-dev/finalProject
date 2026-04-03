import React, { useState, useEffect, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Phone, Clock, Loader2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { useAccommodations } from '../../api/accommodation/useAccommodation';
import WishlistButton from '../../components/common/WishlistButton';
import heroImg1 from '../../assets/images/accommodation/월정리.webp';
import heroImg2 from '../../assets/images/accommodation/협재2.webp';

const heroSlides = [heroImg1, heroImg2];

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600';

function formatPrice(priceMin, priceMax) {
  if (!priceMin && !priceMax) return '가격 문의';
  if (priceMin && priceMax) {
    return `${(priceMin / 10000).toFixed(0)}~${(priceMax / 10000).toFixed(0)}만원`;
  }
  if (priceMin) return `${(priceMin / 10000).toFixed(0)}만원~`;
  return `~${(priceMax / 10000).toFixed(0)}만원`;
}

function parseFacilities(facilities) {
  if (!facilities) return [];
  return facilities.split(',').map(f => f.trim()).filter(f => f);
}

const cardVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.35 },
  }),
};


export default function Accommodations() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    region: 'all',
    priceRange: 'all',
    type: 'all'
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

  // 클라이언트 필터(검색어·타입·가격대) 사용 여부
  const hasClientFilters = !!searchTerm || filters.type !== 'all' || filters.priceRange !== 'all';

  // 클라이언트 필터 없을 때 → 서버 페이지네이션 (size=9)
  // 클라이언트 필터 있을 때 → 전체 로드 후 프론트 필터링 (size=200)
  const serverPage = hasClientFilters ? 1 : currentPage;
  const serverSize = hasClientFilters ? 200 : pageSize;

  const { data, isLoading, isError, error, refetch } = useAccommodations(serverPage, serverSize, regionParam);

  const accommodations = data?.success ? (data.list || []) : [];
  const serverTotalCount = data?.success ? (data.totalCount || 0) : 0;
  const errorMessage = isError ? '서버와 연결할 수 없습니다.' : (data && !data.success ? (data.message || '숙소 목록을 불러오는데 실패했습니다.') : null);

  // 필터 변경 시 페이지 초기화
  const handleRegionChange = (value) => {
    setFilters({...filters, region: value});
    setCurrentPage(1);
  };

  // 프론트엔드 필터링 (검색어, 타입, 가격대) — 클라이언트 필터 있을 때만 실행
  const filteredAccommodations = useMemo(() => {
    if (!hasClientFilters) return accommodations;
    const searchLower = searchTerm.toLowerCase();
    return accommodations.filter(acc => {
      const matchesSearch = !searchTerm ||
        acc.name?.toLowerCase().includes(searchLower) ||
        acc.address?.toLowerCase().includes(searchLower) ||
        acc.recommendationReason?.toLowerCase().includes(searchLower);

      const matchesType = filters.type === 'all' || acc.accommodationType === filters.type;

      let matchesPriceRange = true;
      if (filters.priceRange !== 'all' && acc.priceMin) {
        const price = acc.priceMin;
        matchesPriceRange =
          filters.priceRange === '10k-30k' ? price >= 10000 && price < 30000 :
          filters.priceRange === '30k-50k' ? price >= 30000 && price < 50000 :
          filters.priceRange === '50k-100k' ? price >= 50000 && price < 100000 :
          filters.priceRange === '100k+' ? price >= 100000 : true;
      }

      return matchesSearch && matchesType && matchesPriceRange && !!acc.thumbnailUrl;
    });
  }, [accommodations, hasClientFilters, searchTerm, filters.type, filters.priceRange]);

  // 페이지네이션
  // 서버 페이지네이션 사용 시: totalCount는 서버 제공값, paginatedAccommodations는 그대로
  // 클라이언트 필터 사용 시: totalCount는 필터된 결과 수, slice로 페이지 분할
  const totalFilteredCount = hasClientFilters ? filteredAccommodations.length : serverTotalCount;
  const totalPages = Math.ceil(totalFilteredCount / pageSize);
  const paginatedAccommodations = hasClientFilters
    ? filteredAccommodations.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredAccommodations;

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
            className="text-white/50 text-sm tracking-[0.3em] uppercase mb-5 font-pretendard"
          >
            Jeju Accommodation
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-cyan-100 shadow-lg shadow-cyan-500/10"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span className="font-pretendard">혼행 추천 숙소</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl font-black mb-6 text-center leading-tight drop-shadow-lg font-gmarket"
          >
            <span className="text-white">제주, 나를 찾는 </span>
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">여행</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-white/70 text-center max-w-md leading-relaxed font-pretendard"
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
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/60 sticky top-16 z-40 font-pretendard" style={{ willChange: 'transform' }}>
        <div className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex items-center gap-3">
            {/* 검색바 */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="숙소명, 주소로 검색..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-10 h-10 bg-slate-50 border-slate-200 focus:border-sky-400 focus:bg-white rounded-lg text-sm transition-colors font-pretendard"
              />
            </div>

            {/* 지역 드롭다운 */}
            <Select modal={false} value={filters.region} onValueChange={handleRegionChange}>
              <SelectTrigger className="h-10 w-[130px] bg-slate-50 border-slate-200 rounded-lg text-sm hover:bg-white transition-colors">
                <SelectValue placeholder="전체 지역" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 지역</SelectItem>
                <SelectItem value="jeju_city">제주시</SelectItem>
                <SelectItem value="seogwipo">서귀포시</SelectItem>
              </SelectContent>
            </Select>

            {/* 유형 드롭다운 */}
            <Select modal={false} value={filters.type} onValueChange={(value) => { setFilters({...filters, type: value}); setCurrentPage(1); }}>
              <SelectTrigger className="h-10 w-[130px] bg-slate-50 border-slate-200 rounded-lg text-sm hover:bg-white transition-colors">
                <SelectValue placeholder="전체 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 유형</SelectItem>
                <SelectItem value="호텔">호텔</SelectItem>
                <SelectItem value="리조트">리조트</SelectItem>
                <SelectItem value="펜션">펜션</SelectItem>
                <SelectItem value="풀빌라">풀빌라</SelectItem>
                <SelectItem value="게스트하우스">게스트하우스</SelectItem>
                <SelectItem value="호스텔">호스텔</SelectItem>
                <SelectItem value="모텔">모텔</SelectItem>
                <SelectItem value="민박">민박</SelectItem>
                <SelectItem value="한옥">한옥</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>

            {/* 가격 드롭다운 */}
            <Select modal={false} value={filters.priceRange} onValueChange={(value) => { setFilters({...filters, priceRange: value}); setCurrentPage(1); }}>
              <SelectTrigger className="h-10 w-[130px] bg-slate-50 border-slate-200 rounded-lg text-sm hover:bg-white transition-colors">
                <SelectValue placeholder="전체 가격" />
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
          <h2 className="text-2xl md:text-3xl font-black mb-2 font-gmarket">
            <span className="text-slate-800">여행자에게 추천하는 </span>
            <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 bg-clip-text text-transparent">숙소</span>
          </h2>
          <p className="text-slate-400 text-sm">
            총 <span className="font-bold text-sky-500">{totalCount}</span>개의 숙소
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
            <p className="text-slate-400 text-sm font-medium">숙소를 찾고 있어요...</p>
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
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={() => {
                      if (!user) { alert('로그인 후 이용할 수 있습니다.'); navigate('/login'); return; }
                      navigate(`/accommodations/${acc.accommodationNo}`);
                    }}
                    className="bg-white rounded-xl overflow-hidden border border-slate-200/80 hover:border-slate-300 hover:shadow-lg transition-all duration-200 cursor-pointer group font-pretendard"
                  >
                    {/* 이미지 */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={acc.thumbnailUrl || DEFAULT_IMAGE}
                        alt={acc.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                      />

                      {/* 찜 버튼 */}
                      <WishlistButton type="accommodation" targetNo={acc.accommodationNo} size="sm" className="absolute top-3 right-3" />

                      {/* 숙소 유형 배지 */}
                      {acc.accommodationType && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 rounded-md text-[11px] font-semibold text-slate-700">
                          {acc.accommodationType}
                        </span>
                      )}
                    </div>

                    {/* 카드 내용 */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-slate-900 text-[16px] leading-snug line-clamp-1">
                          {acc.name}
                        </h3>
                        <span className="text-[15px] font-bold text-slate-800 whitespace-nowrap flex-shrink-0">
                          {formatPrice(acc.priceMin, acc.priceMax)}
                        </span>
                      </div>

                      <p className="text-[13px] text-slate-500 line-clamp-1 mb-2.5">
                        {acc.address || acc.region}
                      </p>

                      {(acc.checkInTime || acc.checkOutTime) && (
                        <p className="text-[12px] text-slate-400 mb-3">
                          {acc.checkInTime && `IN ${acc.checkInTime}`}
                          {acc.checkInTime && acc.checkOutTime && ' · '}
                          {acc.checkOutTime && `OUT ${acc.checkOutTime}`}
                        </p>
                      )}

                      {/* 편의시설 */}
                      {acc.facilities && (
                        <div className="flex flex-wrap gap-1.5">
                          {parseFacilities(acc.facilities).slice(0, 4).map((facility, idx) => (
                            <span key={idx} className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {facility}
                            </span>
                          ))}
                        </div>
                      )}
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
                {(() => {
                  const groupSize = 4;
                  const groupIndex = Math.floor((currentPage - 1) / groupSize);
                  const groupStart = groupIndex * groupSize + 1;
                  const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);
                  const pages = Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i);

                  return (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentPage(groupStart - 1)}
                        disabled={groupStart === 1}
                        className="w-11 h-11 rounded-xl bg-white shadow-md shadow-sky-100 flex items-center justify-center text-slate-400 hover:text-sky-500 hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-sky-50"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                      {pages.map(page => (
                        <motion.button
                          key={page}
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
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentPage(groupEnd + 1)}
                        disabled={groupEnd === totalPages}
                        className="w-11 h-11 rounded-xl bg-white shadow-md shadow-sky-100 flex items-center justify-center text-slate-400 hover:text-sky-500 hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-sky-50"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
