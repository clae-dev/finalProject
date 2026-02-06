import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Heart, Phone, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { getAccommodationList } from '../api/accommodationAPI';
import heroImg from '../assets/images/월정리.png';

export default function Accommodations() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    region: 'all',
    type: 'all',
    priceRange: 'all'
  });

  // API 데이터 상태
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // 숙소 데이터 로드
  useEffect(() => {
    fetchAccommodations();
  }, [currentPage, filters.region]);

  const fetchAccommodations = async () => {
    setLoading(true);
    setError(null);

    try {
      const regionParam = filters.region === 'all' ? null :
                          filters.region === 'jeju_city' ? '제주시' : '서귀포시';

      const response = await getAccommodationList(currentPage, pageSize, regionParam);

      if (response.success) {
        setAccommodations(response.list || []);
        setTotalCount(response.totalCount || 0);
      } else {
        setError(response.message || '숙소 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('숙소 목록 조회 실패:', err);
      setError('서버와 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 지역 필터 변경 시 페이지 초기화
  const handleRegionChange = (value) => {
    setFilters({...filters, region: value});
    setCurrentPage(1);
  };

  // 프론트엔드 필터링 (검색어, 숙소유형, 가격대)
  const filteredAccommodations = accommodations.filter(acc => {
    // 검색어 필터
    const matchesSearch = !searchTerm ||
      acc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.recommendationReason?.toLowerCase().includes(searchTerm.toLowerCase());

    // 숙소 유형 필터
    const typeMap = {
      guesthouse: '게스트하우스',
      hostel: '호스텔',
      hotel: '호텔',
      pension: '펜션',
      minbak: '민박',
      resort: '리조트',
      hanok: '한옥',
      poolvilla: '풀빌라',
      motel: '모텔',
    };
    const matchesType = filters.type === 'all' ||
      acc.accommodationType === typeMap[filters.type];

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

    return matchesSearch && matchesType && matchesPriceRange;
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

  // 총 페이지 수
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* 히어로 섹션 */}
      <div className="relative h-[450px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="제주 숙소"
            className="w-full h-full object-cover object-[center_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/50 via-cyan-900/30 to-blue-900/40" />
        </div>

        {/* 배경 장식 */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-400/20 to-sky-400/20 backdrop-blur-md rounded-full text-sm font-semibold mb-8 border border-cyan-300/30 shadow-lg shadow-cyan-500/20">
            <span className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse shadow-lg shadow-cyan-400" />
            <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">혼행 추천 숙소</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-5 text-center leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-50 to-sky-100 bg-clip-text text-transparent drop-shadow-2xl">
              제주, 나를 찾는 여행
            </span>
          </h1>
          <p className="text-base md:text-lg text-cyan-50/90 text-center max-w-2xl leading-relaxed">
            바다 소리에 귀 기울이고, 바람에 마음을 맡기는<br className="hidden md:block" />
            <span className="text-white font-semibold">당신만의 특별한 시간</span>
          </p>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 py-6">

          {/* 검색바 */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="숙소명, 주소로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-11 bg-slate-50 border-slate-200 focus:border-sky-400 rounded-lg"
            />
          </div>

          {/* 필터 */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <Select value={filters.region} onValueChange={handleRegionChange}>
                <SelectTrigger className="h-10 bg-white border-slate-200">
                  <SelectValue placeholder="전체 지역" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 지역</SelectItem>
                  <SelectItem value="jeju_city">제주시</SelectItem>
                  <SelectItem value="seogwipo">서귀포시</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                <SelectTrigger className="h-10 bg-white border-slate-200">
                  <SelectValue placeholder="숙소 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 유형</SelectItem>
                  <SelectItem value="minbak">민박</SelectItem>
                  <SelectItem value="guesthouse">게스트하우스</SelectItem>
                  <SelectItem value="pension">펜션</SelectItem>
                  <SelectItem value="hotel">호텔</SelectItem>
                  <SelectItem value="hostel">호스텔</SelectItem>
                  <SelectItem value="resort">리조트</SelectItem>
                  <SelectItem value="hanok">한옥</SelectItem>
                  <SelectItem value="poolvilla">풀빌라</SelectItem>
                  <SelectItem value="motel">모텔</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.priceRange} onValueChange={(value) => setFilters({...filters, priceRange: value})}>
                <SelectTrigger className="h-10 bg-white border-slate-200">
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
      </div>

      {/* 숙소 목록 */}
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">혼행에게 추천하는 숙소</h2>
          <p className="text-slate-500">
            총 <span className="font-semibold text-sky-600">{totalCount}</span>개의 숙소
            {filteredAccommodations.length !== accommodations.length &&
              ` (필터 적용: ${filteredAccommodations.length}개)`
            }
          </p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            <span className="ml-3 text-slate-500">숙소 정보를 불러오는 중...</span>
          </div>
        )}

        {/* 에러 상태 */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-rose-500 text-lg mb-2">{error}</p>
            <button
              onClick={fetchAccommodations}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 숙소 카드 그리드 */}
        {!loading && !error && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccommodations.map(acc => (
                <div key={acc.accommodationNo} className="group cursor-pointer" onClick={() => navigate(`/accommodations/${acc.accommodationNo}`)}>
                  <div className="relative rounded-2xl overflow-hidden mb-4 shadow-md hover:shadow-xl transition-all">
                    <div className="aspect-[4/3]">
                      <img
                        src={acc.thumbnailUrl || defaultImage}
                        alt={acc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = defaultImage; }}
                      />
                    </div>
                    <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Heart className="w-4 h-4 text-slate-400 hover:text-rose-500 transition-colors" />
                    </button>
                    {acc.accommodationType && (
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-white/95 text-slate-700 text-xs px-2 py-1 backdrop-blur">
                          {acc.accommodationType}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="px-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{acc.name}</h3>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="line-clamp-1">{acc.address || acc.region}</span>
                    </div>

                    {acc.phone && (
                      <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{acc.phone}</span>
                      </div>
                    )}

                    {(acc.checkInTime || acc.checkOutTime) && (
                      <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>
                          {acc.checkInTime && `입실 ${acc.checkInTime}`}
                          {acc.checkInTime && acc.checkOutTime && ' / '}
                          {acc.checkOutTime && `퇴실 ${acc.checkOutTime}`}
                        </span>
                      </div>
                    )}

                    {acc.recommendationReason && (
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{acc.recommendationReason}</p>
                    )}

                    {/* 편의시설 */}
                    {acc.facilities && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {parseFacilities(acc.facilities).slice(0, 3).map((facility, idx) => (
                          <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {facility}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        {acc.region}
                      </div>
                      <div className="text-sky-600 text-sm font-semibold">
                        {formatPrice(acc.priceMin, acc.priceMax)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-sky-500 text-white'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}

            {filteredAccommodations.length === 0 && !loading && (
              <div className="text-center py-16">
                <p className="text-slate-400 text-lg">검색 결과가 없습니다</p>
                <p className="text-slate-400 text-sm mt-2">다른 조건으로 검색해보세요</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
