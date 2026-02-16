import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { useAccommodationDetail } from '../../api/accommodation/useAccommodation';
import { useUpdateAccommodation } from '../../api/admin/useAdmin';
import AccommodationFormModal from '../../components/accommodation/AccommodationFormModal';
import { AuthContext } from '../../components/AuthContext';
import { useAccommodationReviews, useReviewSummary, useDeleteAccommodationReview } from '../../api/accommodation/useAccommodationReview';
import AccommodationReviewCard from '../../components/accommodation/AccommodationReviewCard';
import { Button } from '@/components/ui/button';
import {
  Star, Heart, MapPin, Clock, ChevronLeft, ChevronRight,
  Phone, Share2, Loader2, AlertCircle, Car, UtensilsCrossed,
  Dumbbell, Bath, Flame, Building2, DoorOpen, DoorClosed,
  Banknote, Eye, Compass, Sparkles, ExternalLink, Check, Search,
  Wifi, Coffee, Mountain, Waves, Sun, TreePalm, Navigation,
  Shield, Calendar, Tag, ArrowLeft, Bookmark, MessageCircle,
  CircleDollarSign, Map, PhoneCall, Globe, Copy, Megaphone, Pencil
} from 'lucide-react';

export default function AccommodationDetail() {
  const { accommodationNo } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { user } = useContext(AuthContext);
  const isAdmin = user && user.memberRole === 'A';
  const updateAccom = useUpdateAccommodation();

  const { data, isLoading, isError } = useAccommodationDetail(accommodationNo);

  const accommodation = data?.success ? data.data : null;
  const errorMessage = isError ? '서버와 연결할 수 없습니다.' : (data && !data.success ? (data.message || '숙소 정보를 불러오는데 실패했습니다.') : null);

  const defaultImage = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800';

  const formatPrice = (priceMin, priceMax) => {
    if (!priceMin && !priceMax) return null;
    if (priceMin && priceMax && priceMin !== priceMax) {
      return `${priceMin.toLocaleString()} ~ ${priceMax.toLocaleString()}`;
    }
    return priceMin ? `${priceMin.toLocaleString()}~` : `~${priceMax.toLocaleString()}`;
  };

  const formatPriceShort = (priceMin, priceMax) => {
    if (!priceMin && !priceMax) return '가격 문의';
    if (priceMin) return `${priceMin.toLocaleString()}`;
    return `${priceMax.toLocaleString()}`;
  };

  // 편의시설 파싱 (쉼표 + 슬래시 모두 분리)
  const parseFacilities = (facilities) => {
    if (!facilities) return [];
    return facilities
      .split(/[,/]/)
      .map(f => f.trim())
      .filter(f => f && f.length > 0 && f !== '등');
  };

  // 편의시설 아이콘 + 색상 매핑
  const getFacilityStyle = (facility) => {
    const f = facility.toLowerCase();
    if (f.includes('주차')) return { icon: Car, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' };
    if (f.includes('수영') || f.includes('풀')) return { icon: Waves, color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50', text: 'text-cyan-600' };
    if (f.includes('사우나') || f.includes('스파') || f.includes('욕')) return { icon: Bath, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50', text: 'text-pink-600' };
    if (f.includes('바비큐') || f.includes('bbq')) return { icon: Flame, color: 'from-orange-500 to-red-500', bg: 'bg-orange-50', text: 'text-orange-600' };
    if (f.includes('식음료') || f.includes('레스토랑') || f.includes('카페') || f.includes('조식')) return { icon: Coffee, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' };
    if (f.includes('스포츠') || f.includes('피트니스') || f.includes('헬스')) return { icon: Dumbbell, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-600' };
    if (f.includes('세탁')) return { icon: Sparkles, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-600' };
    if (f.includes('노래')) return { icon: Megaphone, color: 'from-fuchsia-500 to-pink-600', bg: 'bg-fuchsia-50', text: 'text-fuchsia-600' };
    if (f.includes('골프')) return { icon: Mountain, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', text: 'text-green-600' };
    if (f.includes('키즈') || f.includes('놀이')) return { icon: Sun, color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-50', text: 'text-yellow-600' };
    if (f.includes('세미나') || f.includes('비즈니스')) return { icon: Globe, color: 'from-slate-500 to-gray-600', bg: 'bg-slate-50', text: 'text-slate-600' };
    if (f.includes('마사지')) return { icon: Heart, color: 'from-rose-400 to-pink-500', bg: 'bg-rose-50', text: 'text-rose-500' };
    if (f.includes('루프탑')) return { icon: Sun, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600' };
    if (f.includes('주방') || f.includes('취사')) return { icon: UtensilsCrossed, color: 'from-teal-500 to-emerald-600', bg: 'bg-teal-50', text: 'text-teal-600' };
    if (f.includes('wifi') || f.includes('와이파이') || f.includes('인터넷')) return { icon: Wifi, color: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50', text: 'text-indigo-600' };
    if (f.includes('픽업')) return { icon: Navigation, color: 'from-sky-500 to-blue-500', bg: 'bg-sky-50', text: 'text-sky-600' };
    return { icon: Sparkles, color: 'from-sky-500 to-cyan-500', bg: 'bg-sky-50', text: 'text-sky-600' };
  };

  // 숙소 유형 아이콘 + 색상
  const getTypeStyle = (type) => {
    const map = {
      '호텔':       { icon: Building2, color: 'from-indigo-500 to-blue-600', badge: 'bg-indigo-100 text-indigo-700' },
      '리조트':     { icon: TreePalm, color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-700' },
      '펜션':       { icon: Mountain, color: 'from-green-500 to-emerald-600', badge: 'bg-green-100 text-green-700' },
      '풀빌라':     { icon: Waves, color: 'from-cyan-500 to-blue-600', badge: 'bg-cyan-100 text-cyan-700' },
      '게스트하우스': { icon: Coffee, color: 'from-amber-500 to-orange-600', badge: 'bg-amber-100 text-amber-700' },
      '호스텔':     { icon: Bookmark, color: 'from-violet-500 to-purple-600', badge: 'bg-violet-100 text-violet-700' },
      '모텔':       { icon: Building2, color: 'from-slate-500 to-gray-600', badge: 'bg-slate-100 text-slate-700' },
      '민박':       { icon: Heart, color: 'from-rose-500 to-pink-600', badge: 'bg-rose-100 text-rose-700' },
      '한옥':       { icon: Shield, color: 'from-yellow-600 to-amber-700', badge: 'bg-yellow-100 text-yellow-700' },
      '기타':       { icon: Building2, color: 'from-gray-500 to-slate-600', badge: 'bg-gray-100 text-gray-700' },
    };
    return map[type] || map['기타'];
  };

  // 혼행 TIP 생성
  const generateHondiTips = (acc) => {
    const tips = [];
    const type = acc.accommodationType || '기타';

    if (type === '호텔' || type === '리조트') {
      tips.push({ icon: Shield, text: '프론트 데스크에 짐 보관 요청 가능해요', color: 'text-indigo-500' });
      tips.push({ icon: Coffee, text: '1인 조식 이용 가능 여부 미리 확인하세요', color: 'text-amber-500' });
    } else if (type === '게스트하우스' || type === '호스텔') {
      tips.push({ icon: MessageCircle, text: '공용 공간에서 다른 여행자와 교류해보세요', color: 'text-sky-500' });
      tips.push({ icon: Shield, text: '개인 귀중품은 락커에 보관하세요', color: 'text-violet-500' });
    } else if (type === '펜션' || type === '풀빌라') {
      tips.push({ icon: UtensilsCrossed, text: '근처 마트에서 장보고 직접 요리해보세요', color: 'text-emerald-500' });
      tips.push({ icon: Sun, text: '테라스에서 제주 일몰 감상 추천!', color: 'text-orange-500' });
    } else {
      tips.push({ icon: Phone, text: '체크인 전 호스트에게 미리 연락하세요', color: 'text-sky-500' });
      tips.push({ icon: Map, text: '주변 맛집/카페 추천 받아보세요', color: 'text-teal-500' });
    }

    if (acc.checkInTime) {
      tips.push({ icon: Clock, text: `체크인 ${acc.checkInTime} 이전에 도착하면 짐 보관 문의하세요`, color: 'text-violet-500' });
    }
    if (acc.facilities?.includes('주차')) {
      tips.push({ icon: Car, text: '렌터카 이용 시 주차 가능 확인 완료!', color: 'text-blue-500' });
    }
    if (!acc.facilities?.includes('주차')) {
      tips.push({ icon: Navigation, text: '대중교통/택시 이용을 추천해요', color: 'text-cyan-500' });
    }
    tips.push({ icon: Compass, text: '제주의 아름다운 풍경, 인생샷 남겨보세요', color: 'text-rose-500' });

    return tips.slice(0, 5);
  };

  // 카카오맵 초기화 (SDK 로딩 대기)
  useEffect(() => {
    if (!accommodation?.latitude || !accommodation?.longitude) return;
    if (!mapRef.current) return;

    const initMap = () => {
      const lat = accommodation.latitude;
      const lng = accommodation.longitude;
      const position = new window.kakao.maps.LatLng(lat, lng);

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: position,
        level: 3,
      });

      const marker = new window.kakao.maps.Marker({ position });
      marker.setMap(map);

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px 10px;font-size:12px;font-weight:bold;white-space:nowrap;">${accommodation.name}</div>`,
      });
      infowindow.open(map, marker);

      setMapLoaded(true);
    };

    if (window.kakao?.maps?.Map) {
      initMap();
      return;
    }

    if (window.kakao?.maps?.load) {
      window.kakao.maps.load(initMap);
      return;
    }

    let retryCount = 0;
    const interval = setInterval(() => {
      retryCount++;
      if (window.kakao?.maps?.load) {
        clearInterval(interval);
        window.kakao.maps.load(initMap);
      } else if (retryCount > 20) {
        clearInterval(interval);
        console.warn('카카오맵 SDK 로드 실패');
      }
    }, 300);

    return () => clearInterval(interval);
  }, [accommodation]);

  // 예약 문의
  const handleReservation = () => {
    if (accommodation?.phone) {
      window.location.href = `tel:${accommodation.phone}`;
    } else {
      const query = encodeURIComponent(accommodation?.name + ' 제주 예약');
      window.open(`https://search.naver.com/search.naver?query=${query}`, '_blank');
    }
  };

  const handleSearchNaver = () => {
    const query = encodeURIComponent(accommodation?.name + ' 제주');
    window.open(`https://search.naver.com/search.naver?query=${query}`, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: accommodation?.name,
      text: `${accommodation?.name} - ${accommodation?.region || '제주'} ${accommodation?.accommodationType || '숙소'}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        if (e.name !== 'AbortError') copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-6 h-6 text-sky-500 animate-spin mb-3" />
          <span className="text-slate-400 text-sm font-medium">숙소 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (errorMessage || !accommodation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <p className="text-rose-500 text-lg font-semibold mb-2">{errorMessage || '숙소를 찾을 수 없습니다.'}</p>
          <p className="text-slate-400 text-sm mb-6">잠시 후 다시 시도해주세요</p>
          <Button onClick={() => navigate('/accommodations')} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const images = accommodation.imageUrls?.length > 0
    ? accommodation.imageUrls
    : [accommodation.thumbnailUrl || defaultImage];
  const facilities = parseFacilities(accommodation.facilities);
  const hondiTips = generateHondiTips(accommodation);
  const priceDisplay = formatPrice(accommodation.priceMin, accommodation.priceMax);
  const typeStyle = getTypeStyle(accommodation.accommodationType);
  const TypeIcon = typeStyle.icon;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-[#f8fafb]" style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>
      <Header />

      <div className="pt-24 max-w-6xl mx-auto px-5 py-8">

        {/* 뒤로가기 + 브레드크럼 */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate('/accommodations')} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-sky-500 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>숙소 목록</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm text-slate-600 font-medium">{accommodation.name}</span>
        </div>

        {/* 이미지 갤러리 */}
        <div className="mb-8">
          <div className="relative h-[320px] md:h-[440px] rounded-2xl overflow-hidden shadow-md group">
            <img
              src={images[currentImageIndex]}
              alt={accommodation.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.target.src = defaultImage; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* 이미지 위 오버레이 정보 */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 ${typeStyle.badge} text-xs font-bold rounded-full backdrop-blur-sm flex items-center gap-1.5`}>
                  <TypeIcon className="w-3.5 h-3.5" />
                  {accommodation.accommodationType}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/30">
                  {accommodation.region}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg" style={{ fontFamily: "'GmarketSans', 'Pretendard', sans-serif" }}>{accommodation.name}</h1>
            </div>

            {/* 이미지 네비게이션 */}
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all opacity-0 group-hover:opacity-100">
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all opacity-0 group-hover:opacity-100">
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>

            {/* 우측 상단 액션 버튼들 */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="w-10 h-10 bg-amber-400/90 hover:bg-amber-400 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all"
                  title="숙소 수정"
                >
                  <Pencil className="w-4 h-4 text-white" />
                </button>
              )}
              <button
                onClick={handleShare}
                className="w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-slate-600" />}
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
              </button>
            </div>

            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white text-xs font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 왼쪽: 숙소 정보 */}
          <div className="md:col-span-2 space-y-5">

            {/* 핵심 정보 카드 4개 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                <DoorOpen className="w-5 h-5 text-sky-500 mx-auto mb-2" />
                <div className="text-[11px] text-slate-400 font-medium mb-0.5">체크인</div>
                <div className="text-[15px] font-semibold text-slate-700">{accommodation.checkInTime || '-'}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                <DoorClosed className="w-5 h-5 text-violet-500 mx-auto mb-2" />
                <div className="text-[11px] text-slate-400 font-medium mb-0.5">체크아웃</div>
                <div className="text-[15px] font-semibold text-slate-700">{accommodation.checkOutTime || '-'}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                <CircleDollarSign className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                <div className="text-[11px] text-slate-400 font-medium mb-0.5">가격대</div>
                <div className="text-[15px] font-semibold text-slate-700">
                  {accommodation.priceMin ? `${(accommodation.priceMin / 10000).toFixed(0)}만~` : '문의'}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                <TypeIcon className="w-5 h-5 text-slate-500 mx-auto mb-2" />
                <div className="text-[11px] text-slate-400 font-medium mb-0.5">유형</div>
                <div className="text-[15px] font-semibold text-slate-700">{accommodation.accommodationType || '숙소'}</div>
              </div>
            </div>

            {/* 위치 & 연락처 */}
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <h2 className="text-[17px] font-bold text-slate-800 mb-4 flex items-center gap-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                <MapPin className="w-[18px] h-[18px] text-sky-500" />
                위치 & 연락처
              </h2>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3.5 bg-gradient-to-r from-slate-50 to-sky-50/40 rounded-xl border border-slate-100 hover:border-sky-200 transition-colors">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-sky-500" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Address</div>
                    <div className="text-sm font-medium text-slate-700">{accommodation.address}</div>
                  </div>
                </div>
                {accommodation.phone && (
                  <div className="flex items-start gap-3 p-3.5 bg-gradient-to-r from-slate-50 to-emerald-50/40 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Contact</div>
                      <a href={`tel:${accommodation.phone}`} className="text-sm font-medium text-emerald-600 hover:underline">
                        {accommodation.phone}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 p-3.5 bg-gradient-to-r from-slate-50 to-violet-50/40 rounded-xl border border-slate-100 hover:border-violet-200 transition-colors">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Check-in / Check-out</div>
                    <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-100 text-sky-700 rounded-md text-xs font-bold">
                        <DoorOpen className="w-3 h-3" /> IN {accommodation.checkInTime || '15:00'}
                      </span>
                      <span className="text-slate-300">~</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-600 rounded-md text-xs font-bold">
                        <DoorClosed className="w-3 h-3" /> OUT {accommodation.checkOutTime || '11:00'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 편의시설 */}
            {facilities.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-slate-100">
                <h2 className="text-[17px] font-bold text-slate-800 mb-4 flex items-center gap-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  <Sparkles className="w-[18px] h-[18px] text-emerald-500" />
                  편의시설 & 서비스
                </h2>
                <div className="flex flex-wrap gap-2">
                  {facilities.map((facility, idx) => {
                    const style = getFacilityStyle(facility);
                    const FacIcon = style.icon;
                    return (
                      <span key={idx} className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${style.bg} rounded-lg border border-slate-100`}>
                        <FacIcon className={`w-3.5 h-3.5 ${style.text}`} />
                        <span className={`text-xs font-medium ${style.text}`}>{facility}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 가격 정보 */}
            {priceDisplay && (
              <div className="bg-white rounded-xl p-6 border border-slate-100">
                <h2 className="text-[17px] font-bold text-slate-800 mb-4 flex items-center gap-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  <Banknote className="w-[18px] h-[18px] text-amber-500" />
                  객실 가격 안내
                </h2>
                <div className="bg-emerald-50/60 rounded-lg p-5 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Tag className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs text-emerald-600 font-semibold">1박 기준</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-800 flex items-center gap-1">
                        <span className="text-emerald-500">W</span> {priceDisplay}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/80 rounded-lg text-[11px] text-slate-500 font-medium">
                        <Calendar className="w-3 h-3" /> 시즌별 상이
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 숙소 소개 */}
            {accommodation.recommendationReason && (
              <div className="bg-white rounded-xl p-6 border border-slate-100">
                <h2 className="text-[17px] font-bold text-slate-800 mb-4 flex items-center gap-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  <Compass className="w-[18px] h-[18px] text-rose-400" />
                  숙소 소개
                </h2>
                <p className="text-[13px] text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg whitespace-pre-line">
                  {accommodation.recommendationReason}
                </p>
              </div>
            )}

            {/* 숙소 후기 */}
            <AccommodationReviewSection accommodationNo={accommodationNo} user={user} navigate={navigate} />
          </div>

          {/* 오른쪽 사이드바 */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* 예약 카드 */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-sky-400" />

                <div className="mb-4 pt-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm text-slate-400 font-medium">W</span>
                    <span className="text-3xl font-extrabold text-slate-800">
                      {formatPriceShort(accommodation.priceMin, accommodation.priceMax)}
                    </span>
                    {accommodation.priceMin && <span className="text-sm font-normal text-slate-400">/ 박</span>}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-sm text-slate-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-700">4.5</span>
                    <span className="text-slate-300">|</span>
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{accommodation.viewCount || 0}회</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2.5 text-sm p-2.5 bg-slate-50 rounded-xl">
                    <MapPin className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span className="text-slate-600 line-clamp-2 text-xs">{accommodation.address}</span>
                  </div>
                  {accommodation.phone && (
                    <div className="flex items-center gap-2.5 text-sm p-2.5 bg-slate-50 rounded-xl">
                      <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-600 text-xs">{accommodation.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 text-sm p-2.5 bg-slate-50 rounded-xl">
                    <Clock className="w-4 h-4 text-violet-500 flex-shrink-0" />
                    <span className="text-slate-600 text-xs">
                      IN {accommodation.checkInTime || '15:00'} ~ OUT {accommodation.checkOutTime || '11:00'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Button
                    onClick={handleReservation}
                    className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm gap-2"
                  >
                    {accommodation.phone ? (
                      <><PhoneCall className="w-4 h-4" /> 전화 예약하기</>
                    ) : (
                      <><Search className="w-4 h-4" /> 예약 검색하기</>
                    )}
                  </Button>
                  <button
                    onClick={handleSearchNaver}
                    className="w-full h-10 bg-[#03C75A] hover:bg-[#02b350] rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2 text-sm shadow-md shadow-green-200/30"
                  >
                    <ExternalLink className="w-4 h-4" />
                    네이버에서 검색
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full h-10 border-2 border-slate-200 hover:border-sky-300 hover:bg-sky-50 rounded-xl font-semibold text-slate-500 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {copied ? (
                      <><Check className="w-4 h-4 text-emerald-500" /><span className="text-emerald-500">복사 완료!</span></>
                    ) : (
                      <><Copy className="w-4 h-4" /> 링크 공유</>
                    )}
                  </button>
                </div>
              </div>

              {/* 혼행 TIP */}
              <div className="bg-sky-50/80 rounded-2xl p-5 border border-sky-100">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Compass className="w-[18px] h-[18px] text-cyan-500" />
                    <div>
                      <div className="text-sm font-bold text-slate-700">혼행 TIP</div>
                      <div className="text-[10px] text-slate-400 font-medium">혼자 여행하는 당신을 위한 꿀팁</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {hondiTips.map((tip, idx) => {
                      const TipIcon = tip.icon;
                      return (
                        <div key={idx} className="flex items-start gap-2 p-2.5 bg-white/80 rounded-lg">
                          <TipIcon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${tip.color}`} />
                          <span className="text-xs text-slate-600 leading-relaxed">{tip.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 위치 지도 */}
              <div className="bg-white rounded-xl p-5 border border-slate-100">
                <h3 className="text-[15px] font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Map className="w-[18px] h-[18px] text-teal-500" />
                  위치
                </h3>

                {accommodation.latitude && accommodation.longitude ? (
                  <>
                    <div
                      ref={mapRef}
                      className="h-48 rounded-xl overflow-hidden border border-slate-200"
                      style={{ width: '100%' }}
                    />

                    {!mapLoaded && !window.kakao?.maps && (
                      <a
                        href={`https://map.kakao.com/link/map/${encodeURIComponent(accommodation.name)},${accommodation.latitude},${accommodation.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-48 bg-gradient-to-br from-cyan-50 to-sky-100 rounded-xl relative group cursor-pointer border border-sky-100 -mt-48"
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <MapPin className="w-8 h-8 text-sky-500 mb-2" />
                          <span className="text-sm font-semibold text-sky-700">카카오맵에서 보기</span>
                        </div>
                      </a>
                    )}

                    <div className="flex gap-2 mt-2.5">
                      <a
                        href={`https://map.kakao.com/link/to/${encodeURIComponent(accommodation.name)},${accommodation.latitude},${accommodation.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#FEE500] hover:bg-[#FDD800] rounded-xl text-xs font-bold text-[#3C1E1E] transition-colors shadow-sm"
                      >
                        <Navigation className="w-3.5 h-3.5" /> 길찾기
                      </a>
                      <a
                        href={`https://map.naver.com/p/search/${encodeURIComponent(accommodation.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#03C75A] hover:bg-[#02b350] rounded-xl text-xs font-bold text-white transition-colors shadow-sm"
                      >
                        <Map className="w-3.5 h-3.5" /> 네이버지도
                      </a>
                    </div>
                  </>
                ) : (
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent(accommodation.name + ' ' + (accommodation.address || '제주'))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-48 bg-gradient-to-br from-cyan-50 to-sky-100 rounded-xl overflow-hidden relative group cursor-pointer border border-sky-100 hover:border-sky-300 transition-all"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Search className="w-7 h-7 text-sky-500" />
                      </div>
                      <span className="text-sm font-semibold text-sky-700">카카오맵에서 검색</span>
                      <span className="text-[10px] text-sky-400 mt-0.5">클릭하면 지도가 열립니다</span>
                    </div>
                  </a>
                )}

                <div className="mt-3 text-xs text-slate-500 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>{accommodation.address}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* 관리자 수정 모달 */}
      {isAdmin && (
        <AccommodationFormModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          editTarget={accommodation}
          isPending={updateAccom.isPending}
          onSubmit={(formData) => {
            updateAccom.mutate(
              { accommodationNo: accommodation.accommodationNo, formData },
              {
                onSuccess: (res) => {
                  if (res?.success) {
                    setEditModalOpen(false);
                  } else {
                    alert(res?.message || '수정 실패');
                  }
                },
              }
            );
          }}
        />
      )}
    </div>
  );
}

// 숙소 후기 섹션 (인라인 컴포넌트)
function AccommodationReviewSection({ accommodationNo, user, navigate }) {
  const [reviewPage, setReviewPage] = useState(1);
  const { data: reviewData, isLoading: reviewsLoading } = useAccommodationReviews(Number(accommodationNo), reviewPage, 5);
  const { data: summaryData } = useReviewSummary(Number(accommodationNo));
  const deleteMutation = useDeleteAccommodationReview(Number(accommodationNo));

  const reviews = reviewData?.list || [];
  const totalCount = reviewData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / 5);
  const summary = summaryData?.data || {};

  const handleDelete = (reviewNo) => {
    deleteMutation.mutate(reviewNo, {
      onSuccess: (res) => {
        if (res.success) alert('후기가 삭제되었습니다.');
      },
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[17px] font-bold text-slate-800 flex items-center gap-2" style={{ fontFamily: "'Pretendard', sans-serif" }}>
          <Star className="w-[18px] h-[18px] text-amber-400" />
          숙소 후기
          {totalCount > 0 && (
            <span className="text-sm font-normal text-slate-400 ml-1">
              ({summary.avgRating || 0}점 / {totalCount}개)
            </span>
          )}
        </h2>
        {user && (
          <Button
            onClick={() => navigate(`/accommodations/${accommodationNo}/review/write`)}
            className="bg-sky-500 hover:bg-sky-600 text-sm gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            후기 작성
          </Button>
        )}
      </div>

      {/* 평균 별점 요약 */}
      {totalCount > 0 && (
        <div className="flex items-center gap-3 mb-5 p-3 bg-amber-50/50 rounded-lg border border-amber-100/50">
          <div className="text-3xl font-black text-amber-500">{summary.avgRating || 0}</div>
          <div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(summary.avgRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{totalCount}개의 후기</p>
          </div>
        </div>
      )}

      {/* 후기 목록 */}
      {reviewsLoading ? (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-sky-500 mx-auto" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <AccommodationReviewCard
              key={review.reviewNo}
              review={review}
              currentUserNo={user?.memberNo}
              onDelete={handleDelete}
            />
          ))}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setReviewPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                    reviewPage === i + 1
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-500 hover:bg-sky-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-500">아직 작성된 후기가 없습니다</p>
          <p className="text-xs mt-1.5 text-slate-300">이 숙소의 첫 번째 후기를 남겨주세요!</p>
        </div>
      )}
    </div>
  );
}
