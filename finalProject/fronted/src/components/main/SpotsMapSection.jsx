import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, X } from 'lucide-react';
import { useActiveSpots } from '../../api/spot/useSpot';
import KakaoMap from '../common/KakaoMap';

/* ─── 기본 명소 데이터 (좌표 포함) ─── */
const DEFAULT_SPOTS = [
  {
    spotNo: 1, spotTitle: '월정리 해변', spotDesc: '에메랄드빛 투명한 바다',
    spotLocation: '제주시 구좌읍 월정리',
    spotImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    spotTag: '🔥 인기', lat: 33.4500, lng: 126.9275,
  },
  {
    spotNo: 2, spotTitle: '협재해수욕장', spotDesc: '새하얀 모래와 옥빛 바다',
    spotLocation: '제주시 한림읍 협재리',
    spotImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600',
    spotTag: '🏖 해변', lat: 33.4474, lng: 126.3233,
  },
  {
    spotNo: 3, spotTitle: '성산일출봉', spotDesc: '장엄한 일출 명소',
    spotLocation: '서귀포시 성산읍',
    spotImage: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600',
    spotTag: '🌅 일출', lat: 33.5597, lng: 126.9331,
  },
  {
    spotNo: 4, spotTitle: '우도', spotDesc: '섬 속의 작은 섬',
    spotLocation: '제주시 우도면',
    spotImage: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600',
    spotTag: '🚲 우도', lat: 33.5437, lng: 126.8697,
  },
  {
    spotNo: 5, spotTitle: '한라산 백록담', spotDesc: '제주의 지붕, 신비로운 분화구',
    spotLocation: '제주시 해안동',
    spotImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    spotTag: '🌴 자연', lat: 33.3617, lng: 126.5292,
  },
];

/* ─── SVG 캐릭터들 (해변 씬) ─── */
function KiteChild() {
  return (
    <g>
      <motion.line x1="30" y1="48" x2="58" y2="8"
        stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 2"
        initial={{ x2: 58, y2: 8 }}
        animate={{ x2: [58, 62, 54, 58], y2: [8, 5, 10, 8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.g animate={{ x: [0, 4, -4, 0], y: [0, -2, 2, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        <polygon points="58,0 68,12 58,24 48,12" fill="#c084fc" />
        <polygon points="58,0 68,12 58,24 48,12" fill="none" stroke="#a855f7" strokeWidth="1" />
        <motion.path d="M58,24 Q61,32 56,36 Q61,40 57,45"
          stroke="#c084fc" strokeWidth="1.5" fill="none"
          animate={{ d: ["M58,24 Q61,32 56,36 Q61,40 57,45","M58,24 Q63,31 54,37 Q63,41 55,47","M58,24 Q61,32 56,36 Q61,40 57,45"] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>
      <circle cx="28" cy="55" r="8" fill="#fcd34d" />
      <circle cx="26" cy="53.5" r="1.3" fill="#1e293b" />
      <circle cx="31" cy="53.5" r="1.3" fill="#1e293b" />
      <circle cx="24" cy="56" r="2" fill="#fca5a5" opacity="0.6" />
      <circle cx="32" cy="56" r="2" fill="#fca5a5" opacity="0.6" />
      <path d="M26,58 Q28,59.5 30,58" stroke="#1e293b" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <ellipse cx="28" cy="48" rx="10" ry="2.5" fill="#fb923c" />
      <rect x="22" y="43" width="12" height="5" rx="2.5" fill="#fb923c" />
      <rect x="24" y="63" width="8" height="14" rx="4" fill="#38bdf8" />
      <motion.line x1="28" y1="66" x2="35" y2="52"
        stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round"
        animate={{ x2: [35, 37, 33, 35], y2: [52, 50, 54, 52] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <line x1="28" y1="67" x2="20" y2="73" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="26" y1="77" x2="24" y2="90" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="30" y1="77" x2="32" y2="90" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="23" cy="92" rx="4.5" ry="2.5" fill="#ef4444" />
      <ellipse cx="33" cy="92" rx="4.5" ry="2.5" fill="#ef4444" />
    </g>
  );
}

function JumpingChild() {
  return (
    <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}>
      <circle cx="28" cy="40" r="8" fill="#fcd34d" />
      <circle cx="26" cy="38.5" r="1.3" fill="#1e293b" />
      <circle cx="31" cy="38.5" r="1.3" fill="#1e293b" />
      <path d="M25,43 Q28,46 31,43" stroke="#1e293b" strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="23" cy="42" r="2" fill="#fca5a5" opacity="0.6" />
      <circle cx="33" cy="42" r="2" fill="#fca5a5" opacity="0.6" />
      <path d="M22,33 L26,29 L28,33" fill="#f472b6" />
      <path d="M28,33 L30,29 L34,33" fill="#f472b6" />
      <path d="M22,48 L20,72 Q28,76 36,72 L34,48 Q28,45 22,48Z" fill="#f472b6" />
      <motion.line x1="23" y1="52" x2="12" y2="36"
        stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round"
        animate={{ x2: [12, 10, 12], y2: [36, 38, 36] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.line x1="33" y1="52" x2="44" y2="36"
        stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round"
        animate={{ x2: [44, 46, 44], y2: [36, 38, 36] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <line x1="25" y1="72" x2="22" y2="85" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="31" y1="72" x2="34" y2="85" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="21" cy="87" rx="4.5" ry="2.5" fill="#a855f7" />
      <ellipse cx="35" cy="87" rx="4.5" ry="2.5" fill="#a855f7" />
    </motion.g>
  );
}

function Dog() {
  return (
    <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}>
      <ellipse cx="30" cy="18" rx="16" ry="9" fill="#d4a574" />
      <circle cx="50" cy="12" r="8" fill="#d4a574" />
      <ellipse cx="45" cy="5" rx="4" ry="6" fill="#a0845c" transform="rotate(-15 45 5)" />
      <ellipse cx="55" cy="6" rx="4" ry="5.5" fill="#a0845c" transform="rotate(15 55 6)" />
      <circle cx="48" cy="10.5" r="1.5" fill="#1e293b" />
      <circle cx="53" cy="10.5" r="1.5" fill="#1e293b" />
      <ellipse cx="56" cy="14" rx="2.2" ry="1.8" fill="#1e293b" />
      <path d="M54,17 Q56,20 58,17" fill="#f87171" />
      <motion.path d="M14,14 Q8,4 10,0" stroke="#d4a574" strokeWidth="3.5" strokeLinecap="round" fill="none"
        animate={{ d: ["M14,14 Q8,4 10,0","M14,14 Q5,6 12,-2","M14,14 Q8,4 10,0"] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <line x1="22" y1="26" x2="20" y2="36" stroke="#a0845c" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="28" y1="26" x2="29" y2="36" stroke="#a0845c" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="36" y1="26" x2="35" y2="36" stroke="#a0845c" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="42" y1="26" x2="43" y2="36" stroke="#a0845c" strokeWidth="3.5" strokeLinecap="round" />
    </motion.g>
  );
}

function Seagull({ className, delay = 0 }) {
  return (
    <motion.svg className={className} viewBox="0 0 40 20" fill="none"
      animate={{ x: [0, 15, 0], y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <motion.path d="M0,12 Q10,2 20,10 Q30,2 40,12"
        stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"
        animate={{ d: ["M0,12 Q10,2 20,10 Q30,2 40,12","M0,8 Q10,14 20,10 Q30,14 40,8","M0,12 Q10,2 20,10 Q30,2 40,12"] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    </motion.svg>
  );
}

function PalmTree() {
  return (
    <g>
      <rect x="16" y="40" width="6" height="55" rx="3" fill="#a16207" />
      <rect x="17.5" y="44" width="3" height="46" rx="1.5" fill="#92400e" opacity="0.3" />
      <motion.g animate={{ rotate: [0, 2, -1.5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '19px 40px' }}>
        <path d="M19,40 Q32,22 48,26" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M19,40 Q6,20 -8,24" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M19,40 Q28,14 38,8" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M19,40 Q10,12 2,6" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M19,40 Q20,16 19,4" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse cx="21" cy="38" rx="4" ry="3" fill="#ca8a04" />
        <ellipse cx="17" cy="37" rx="3.5" ry="2.5" fill="#a16207" />
      </motion.g>
    </g>
  );
}

/* ─── 명소 카드 (좌측 리스트) ─── */
function SpotCard({ spot, selected, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 p-3.5 rounded-2xl cursor-pointer border-2 transition-all duration-200 ${
        selected
          ? 'border-sky-400 bg-white shadow-lg shadow-sky-100/80'
          : 'border-transparent bg-white/70 hover:bg-white hover:shadow-md hover:border-sky-200'
      }`}
    >
      {/* 썸네일 */}
      <div className="relative w-[72px] h-[72px] flex-shrink-0">
        <img
          src={spot.spotImage}
          alt={spot.spotTitle}
          className="w-full h-full object-cover rounded-xl"
        />
        {selected && (
          <div className="absolute inset-0 rounded-xl ring-2 ring-sky-400 ring-offset-1" />
        )}
      </div>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0 py-0.5">
        <span className="inline-block text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full mb-1 border border-sky-100">
          {spot.spotTag}
        </span>
        <h3
          className={`font-black text-sm truncate transition-colors ${selected ? 'text-sky-700' : 'text-slate-800'}`}
          style={{ fontFamily: "'GmarketSans', sans-serif" }}
        >
          {spot.spotTitle}
        </h3>
        <p className="text-xs text-slate-500 truncate mt-0.5" style={{ fontFamily: "'Pretendard', sans-serif" }}>
          {spot.spotDesc}
        </p>
        <div className="flex items-center gap-1 mt-1.5">
          <MapPin className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
          <span className="text-[10px] text-slate-400 truncate" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            {spot.spotLocation}
          </span>
        </div>
      </div>

      {/* 선택 화살표 */}
      <div className={`flex items-center flex-shrink-0 transition-opacity ${selected ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── 상세 모달 ─── */
function SpotDetailModal({ spot, onClose }) {
  if (!spot) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative h-72 sm:h-80">
            <img src={spot.spotImage} alt={spot.spotTitle} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm font-bold text-slate-700 shadow-lg">
                {spot.spotTag}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg"
                style={{ fontFamily: "'GmarketSans', sans-serif" }}>
                {spot.spotTitle}
              </h3>
            </div>
          </div>
          <div className="p-6 sm:p-8 space-y-5">
            <p className="text-slate-600 text-base leading-relaxed" style={{ fontFamily: "'Pretendard', sans-serif" }}>
              {spot.spotDesc || '제주도의 아름다운 명소입니다.'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {spot.spotLocation && (
                <div className="flex items-center gap-3 p-4 bg-sky-50/80 rounded-2xl">
                  <div className="w-10 h-10 flex items-center justify-center bg-sky-100 rounded-xl">
                    <MapPin className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">위치</p>
                    <p className="text-sm text-slate-700 font-bold">{spot.spotLocation}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-4 bg-amber-50/80 rounded-2xl">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">카테고리</p>
                  <p className="text-sm text-slate-700 font-bold">{spot.spotTag}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl border border-sky-100/50">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">💡</span>
                <div>
                  <p className="text-sm font-bold text-sky-700 mb-1">혼디 추천</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    혼자 여행하기 좋은 명소예요. 여유롭게 산책하며 제주의 자연을 느껴보세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── 검색 결과 카드 ─── */
function SearchResultCard({ place, selected, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 p-3.5 rounded-2xl cursor-pointer border-2 transition-all duration-200 ${
        selected
          ? 'border-sky-400 bg-white shadow-lg shadow-sky-100/80'
          : 'border-transparent bg-white/70 hover:bg-white hover:shadow-md hover:border-sky-200'
      }`}
    >
      <div className="w-9 h-9 flex-shrink-0 bg-sky-100 rounded-xl flex items-center justify-center mt-0.5">
        <MapPin className="w-4 h-4 text-sky-500" />
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className={`font-black text-sm truncate transition-colors ${selected ? 'text-sky-700' : 'text-slate-800'}`}
          style={{ fontFamily: "'GmarketSans', sans-serif" }}
        >
          {place.place_name}
        </h3>
        <p className="text-xs text-slate-500 truncate mt-0.5">
          {place.road_address_name || place.address_name}
        </p>
        {place.category_group_name && (
          <span className="inline-block text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full mt-1 border border-sky-100">
            {place.category_group_name}
          </span>
        )}
        {place.phone && (
          <p className="text-[10px] text-slate-400 mt-1">{place.phone}</p>
        )}
      </div>
      <a
        href={place.place_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex-shrink-0 self-center px-2.5 py-1.5 bg-[#FEE500] hover:bg-[#FDD800] rounded-xl text-[10px] font-bold text-[#3C1E1E] transition-colors"
      >
        지도
      </a>
    </motion.div>
  );
}

/* ─── 메인 컴포넌트 ─── */
export default function SpotsMapSection() {
  const { data } = useActiveSpots();
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [modalSpot, setModalSpot] = useState(null);

  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  // 맵 인스턴스 및 검색 마커 ref
  const mapInstanceRef = useRef(null);
  const searchMarkersRef = useRef([]);

  // API 데이터 or 기본값
  const rawSpots = data?.success && data.data?.length > 0 ? data.data : [];
  const apiSpots = rawSpots
    .filter(s => s.spotLat && s.spotLng)
    .map(s => ({
      spotNo: s.spotNo, spotTitle: s.spotTitle, spotDesc: s.spotDesc,
      spotLocation: s.spotLocation, spotImage: s.spotImage, spotTag: s.spotTag,
      lat: s.spotLat, lng: s.spotLng,
    }));

  const spots = apiSpots.length > 0 ? apiSpots.slice(0, 5) : DEFAULT_SPOTS;
  const markers = spots.map(s => ({ lat: s.lat, lng: s.lng, name: s.spotTitle, info: s.spotTag }));

  const panToMarker = (!isSearchMode && selectedSpot)
    ? { lat: selectedSpot.lat, lng: selectedSpot.lng, name: selectedSpot.spotTitle }
    : null;

  // 검색 실행
  const handleSearch = useCallback(() => {
    const q = searchQuery.trim();
    if (!q || !mapInstanceRef.current || !window.kakao?.maps?.services?.Places) return;

    setIsSearching(true);
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(
      `${q} 제주`,
      (data, status) => {
        setIsSearching(false);
        if (status !== window.kakao.maps.services.Status.OK) {
          setSearchResults([]);
          return;
        }

        // 기존 검색 마커 제거
        searchMarkersRef.current.forEach(m => m.setMap(null));
        searchMarkersRef.current = [];

        const map = mapInstanceRef.current;
        const bounds = new window.kakao.maps.LatLngBounds();

        data.slice(0, 8).forEach((place) => {
          const pos = new window.kakao.maps.LatLng(Number(place.y), Number(place.x));
          const marker = new window.kakao.maps.Marker({ position: pos, map });
          const iw = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:4px 8px;font-size:11px;font-weight:bold;white-space:nowrap;">${place.place_name}</div>`,
          });
          window.kakao.maps.event.addListener(marker, 'click', () => {
            iw.open(map, marker);
            setSelectedResult(place);
          });
          searchMarkersRef.current.push(marker);
          bounds.extend(pos);
        });

        map.setBounds(bounds, 60);
        setSearchResults(data.slice(0, 8));
        setIsSearchMode(true);
        setSelectedResult(null);
      },
      { location: new window.kakao.maps.LatLng(33.3617, 126.5292), radius: 50000 }
    );
  }, [searchQuery]);

  // 검색 초기화
  const clearSearch = useCallback(() => {
    searchMarkersRef.current.forEach(m => m.setMap(null));
    searchMarkersRef.current = [];
    setSearchResults([]);
    setIsSearchMode(false);
    setSearchQuery('');
    setSelectedResult(null);
  }, []);

  // 검색 결과 마커 클릭 시 지도 이동
  const handleResultClick = useCallback((place) => {
    setSelectedResult(place);
    if (!mapInstanceRef.current) return;
    const pos = new window.kakao.maps.LatLng(Number(place.y), Number(place.x));
    mapInstanceRef.current.panTo(pos);
  }, []);

  return (
    <section className="relative pt-16 pb-72 overflow-hidden">
      {/* 하늘 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50/40" />

      {/* 구름들 */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.svg className="absolute top-6 left-[5%] w-36 md:w-48 opacity-80"
          viewBox="0 0 200 80" fill="white"
          animate={{ x: [0, 40, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}>
          <ellipse cx="70" cy="50" rx="55" ry="25" /><ellipse cx="110" cy="42" rx="40" ry="22" />
          <ellipse cx="45" cy="44" rx="30" ry="18" /><ellipse cx="90" cy="36" rx="35" ry="20" />
          <ellipse cx="65" cy="38" rx="28" ry="18" />
        </motion.svg>
        <motion.svg className="absolute top-14 right-[10%] w-28 md:w-36 opacity-70"
          viewBox="0 0 160 60" fill="white"
          animate={{ x: [0, -30, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}>
          <ellipse cx="55" cy="38" rx="40" ry="18" /><ellipse cx="90" cy="32" rx="32" ry="16" />
          <ellipse cx="70" cy="28" rx="28" ry="16" />
        </motion.svg>
        <motion.svg className="absolute top-3 left-[38%] w-24 md:w-32 opacity-60"
          viewBox="0 0 140 50" fill="white"
          animate={{ x: [0, 25, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}>
          <ellipse cx="50" cy="30" rx="35" ry="15" /><ellipse cx="80" cy="26" rx="28" ry="14" />
          <ellipse cx="60" cy="22" rx="22" ry="12" />
        </motion.svg>
        <motion.svg className="absolute top-28 left-[18%] w-20 md:w-24 opacity-50"
          viewBox="0 0 120 45" fill="white"
          animate={{ x: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 5 }}>
          <ellipse cx="40" cy="28" rx="30" ry="13" /><ellipse cx="65" cy="24" rx="24" ry="12" />
          <ellipse cx="50" cy="20" rx="20" ry="11" />
        </motion.svg>
      </div>

      {/* 갈매기 */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <Seagull className="absolute top-16 left-[12%] w-8" delay={0} />
        <Seagull className="absolute top-10 left-[52%] w-6" delay={1.2} />
        <Seagull className="absolute top-20 right-[18%] w-7" delay={2.5} />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-5 relative z-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-sky-600 mb-5 shadow-md shadow-sky-200/40 border border-white/80"
          >
            <span>✨</span>
            <span style={{ fontFamily: "'GmarketSans', sans-serif", letterSpacing: '0.05em' }}>HOT PLACE · JEJU MAP</span>
          </motion.span>
          <h2
            className="text-3xl md:text-5xl font-black text-slate-800"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            혼행러들이 사랑한{' '}
            <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
              명소
            </span>
          </h2>
          <p className="text-slate-500 mt-3 text-base" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            명소를 클릭하면 지도에서 위치를 확인할 수 있어요
          </p>
        </motion.div>

        {/* 스플릿 레이아웃 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-5"
        >
          {/* ─── 좌측: 명소 카드 리스트 or 검색 결과 ─── */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {/* 리스트 제목 */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-sky-400 to-cyan-400 rounded-full" />
                <span className="text-sm font-bold text-slate-600" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  {isSearchMode
                    ? `검색 결과 ${searchResults.length}곳`
                    : `인기 명소 ${spots.length}곳`}
                </span>
              </div>
              {isSearchMode && (
                <button
                  onClick={clearSearch}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> 초기화
                </button>
              )}
            </div>

            {/* 카드 리스트 */}
            <AnimatePresence mode="wait">
              {!isSearchMode ? (
                <motion.div
                  key="spots"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2.5"
                >
                  {spots.map((spot, idx) => (
                    <motion.div
                      key={spot.spotNo}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                    >
                      <SpotCard
                        spot={spot}
                        selected={selectedSpot?.spotNo === spot.spotNo}
                        onClick={() => setSelectedSpot(
                          selectedSpot?.spotNo === spot.spotNo ? null : spot
                        )}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2.5"
                >
                  {searchResults.length === 0 ? (
                    <div className="py-10 text-center text-sm text-slate-400">검색 결과가 없습니다</div>
                  ) : (
                    searchResults.map((place, idx) => (
                      <motion.div
                        key={place.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                      >
                        <SearchResultCard
                          place={place}
                          selected={selectedResult?.id === place.id}
                          onClick={() => handleResultClick(place)}
                        />
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 선택된 명소 상세 패널 (명소 모드) */}
            <AnimatePresence mode="wait">
              {!isSearchMode && selectedSpot && (
                <motion.div
                  key={selectedSpot.spotNo}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-1 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200 shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                        <span className="text-xs font-bold text-sky-600">지도에서 선택됨</span>
                      </div>
                      <p className="font-black text-slate-800 text-sm" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
                        {selectedSpot.spotTitle}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedSpot.spotDesc}</p>
                    </div>
                    <button
                      onClick={() => setModalSpot(selectedSpot)}
                      className="flex-shrink-0 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      자세히 보기
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── 우측: 카카오맵 ─── */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-sky-200/30 border border-white/80 overflow-hidden">
              {/* 맵 헤더 + 검색바 */}
              <div className="px-4 pt-4 pb-3 border-b border-sky-50 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center shadow-sm">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-700" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
                        제주 명소 지도
                      </p>
                      <p className="text-[10px] text-slate-400">마커를 클릭하면 명소 정보를 볼 수 있어요</p>
                    </div>
                  </div>
                  {!isSearchMode && selectedSpot && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100"
                    >
                      📍 {selectedSpot.spotTitle}
                    </motion.span>
                  )}
                </div>

                {/* 검색바 */}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="제주 맛집, 카페, 관광지 검색..."
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition-all"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!searchQuery.trim() || isSearching}
                    className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-1.5 flex-shrink-0"
                  >
                    {isSearching ? (
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    검색
                  </button>
                  {isSearchMode && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </div>

              {/* 지도 */}
              <div className="p-3">
                <KakaoMap
                  lat={33.3617}
                  lng={126.5292}
                  level={10}
                  markers={markers}
                  height="420px"
                  panToMarker={panToMarker}
                  onMapReady={(map) => { mapInstanceRef.current = map; }}
                  onMarkerClick={(m) => {
                    if (isSearchMode) return;
                    const found = spots.find(s => s.spotTitle === m.name);
                    setSelectedSpot(found || null);
                  }}
                />
              </div>

              {/* 하단 명소 태그 */}
              <div className="px-4 pb-4">
                <div className="flex flex-wrap gap-1.5">
                  {spots.map((spot) => (
                    <button
                      key={spot.spotNo}
                      onClick={() => setSelectedSpot(
                        selectedSpot?.spotNo === spot.spotNo ? null : spot
                      )}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        selectedSpot?.spotNo === spot.spotNo
                          ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200'
                      }`}
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      <MapPin className="w-2.5 h-2.5" />
                      {spot.spotTitle}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── 파도 애니메이션 ─── */}
      <div className="absolute bottom-40 left-0 right-0 h-24 pointer-events-none overflow-hidden z-[1]" aria-hidden="true">
        <motion.svg className="absolute bottom-0 w-[110%] -left-[5%] h-full"
          viewBox="0 0 1440 80" preserveAspectRatio="none"
          animate={{ x: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
          <motion.path fill="#bae6fd" opacity="0.4"
            d="M0,50 Q120,30 240,45 Q360,60 480,42 Q600,25 720,48 Q840,65 960,40 Q1080,20 1200,50 Q1320,65 1440,45 L1440,80 L0,80 Z"
            animate={{ d: [
              "M0,50 Q120,30 240,45 Q360,60 480,42 Q600,25 720,48 Q840,65 960,40 Q1080,20 1200,50 Q1320,65 1440,45 L1440,80 L0,80 Z",
              "M0,40 Q120,55 240,38 Q360,22 480,48 Q600,60 720,35 Q840,20 960,50 Q1080,62 1200,38 Q1320,25 1440,50 L1440,80 L0,80 Z",
              "M0,50 Q120,30 240,45 Q360,60 480,42 Q600,25 720,48 Q840,65 960,40 Q1080,20 1200,50 Q1320,65 1440,45 L1440,80 L0,80 Z",
            ] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.svg>
        <motion.svg className="absolute bottom-0 w-[110%] -left-[5%] h-full"
          viewBox="0 0 1440 80" preserveAspectRatio="none"
          animate={{ x: [0, -20, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
          <motion.path fill="#7dd3fc" opacity="0.3"
            d="M0,55 Q180,35 360,52 Q540,68 720,45 Q900,28 1080,55 Q1260,68 1440,48 L1440,80 L0,80 Z"
            animate={{ d: [
              "M0,55 Q180,35 360,52 Q540,68 720,45 Q900,28 1080,55 Q1260,68 1440,48 L1440,80 L0,80 Z",
              "M0,42 Q180,60 360,40 Q540,25 720,52 Q900,65 1080,38 Q1260,25 1440,55 L1440,80 L0,80 Z",
              "M0,55 Q180,35 360,52 Q540,68 720,45 Q900,28 1080,55 Q1260,68 1440,48 L1440,80 L0,80 Z",
            ] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </motion.svg>
        <motion.svg className="absolute bottom-0 w-[115%] -left-[7%] h-full"
          viewBox="0 0 1440 80" preserveAspectRatio="none"
          animate={{ x: [0, 25, 0], y: [0, -4, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
          <motion.path fill="#e0f2fe" opacity="0.5"
            d="M0,62 Q100,48 200,58 Q300,68 400,55 Q500,42 600,60 Q700,70 800,52 Q900,40 1000,58 Q1100,68 1200,54 Q1300,42 1440,60 L1440,80 L0,80 Z"
            animate={{ d: [
              "M0,62 Q100,48 200,58 Q300,68 400,55 Q500,42 600,60 Q700,70 800,52 Q900,40 1000,58 Q1100,68 1200,54 Q1300,42 1440,60 L1440,80 L0,80 Z",
              "M0,52 Q100,65 200,50 Q300,38 400,58 Q500,68 600,48 Q700,36 800,56 Q900,68 1000,50 Q1100,38 1200,60 Q1300,68 1440,50 L1440,80 L0,80 Z",
              "M0,62 Q100,48 200,58 Q300,68 400,55 Q500,42 600,60 Q700,70 800,52 Q900,40 1000,58 Q1100,68 1200,54 Q1300,42 1440,60 L1440,80 L0,80 Z",
            ] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </motion.svg>
        {[8, 18, 32, 45, 58, 72, 85, 94].map((left, i) => (
          <motion.div key={i} className="absolute bottom-1" style={{ left: `${left}%` }}
            animate={{ opacity: [0, 0.7, 0], scale: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}>
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        ))}
      </div>

      {/* ─── 하단 해변 씬 ─── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        aria-hidden="true"
      >
        <svg className="absolute top-0 w-full h-8" viewBox="0 0 1440 30" preserveAspectRatio="none">
          <motion.path fill="#d4a76a" opacity="0.15"
            d="M0,0 Q180,12 360,5 Q540,15 720,3 Q900,14 1080,6 Q1260,16 1440,4 L1440,30 L0,30 Z"
            animate={{ d: [
              "M0,0 Q180,12 360,5 Q540,15 720,3 Q900,14 1080,6 Q1260,16 1440,4 L1440,30 L0,30 Z",
              "M0,8 Q180,0 360,10 Q540,2 720,14 Q900,4 1080,12 Q1260,2 1440,10 L1440,30 L0,30 Z",
              "M0,0 Q180,12 360,5 Q540,15 720,3 Q900,14 1080,6 Q1260,16 1440,4 L1440,30 L0,30 Z",
            ] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 160" preserveAspectRatio="none">
          <path d="M0,30 Q180,10 360,25 Q540,42 720,22 Q900,6 1080,30 Q1260,48 1440,24 L1440,160 L0,160 Z" fill="#fef9c3" opacity="0.7" />
          <path d="M0,55 Q200,40 400,52 Q600,65 800,48 Q1000,35 1200,52 Q1350,62 1440,45 L1440,160 L0,160 Z" fill="#fef08a" opacity="0.4" />
          <path d="M0,80 Q300,68 600,78 Q900,90 1200,76 Q1380,68 1440,72 L1440,160 L0,160 Z" fill="#fde68a" opacity="0.3" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 140" preserveAspectRatio="xMidYMax meet">
          <g transform="translate(40, 0)" opacity="0.65"><PalmTree /></g>
          <g transform="translate(160, 38)" opacity="0.75"><KiteChild /></g>
          <g transform="translate(310, 88)" opacity="0.7"><Dog /></g>
          {[380, 400, 420, 680, 700, 720].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${118 + (i % 2) * 4}) rotate(${i % 2 === 0 ? -8 : 8})`} opacity="0.2">
              <ellipse cx="5" cy="9" rx="3" ry="4.5" fill="#92400e" />
              <circle cx="3" cy="2.5" r="1.2" fill="#92400e" />
              <circle cx="5" cy="1.5" r="1.2" fill="#92400e" />
              <circle cx="7" cy="2.5" r="1.2" fill="#92400e" />
            </g>
          ))}
          <g transform="translate(780, 38)" opacity="0.75"><JumpingChild /></g>
          <g transform="translate(910, 115)" opacity="0.55">
            <path d="M8,0 Q14,5 14,12 Q8,10 2,12 Q2,5 8,0Z" fill="#fda4af" stroke="#fb7185" strokeWidth="0.6" />
          </g>
          <g transform="translate(960, 112)" opacity="0.5">
            <path d="M8,0 L9.5,6 L16,6 L11,9.5 L12.5,16 L8,12 L3.5,16 L5,9.5 L0,6 L6.5,6 Z" fill="#fb923c" />
          </g>
          <g transform="translate(1080, 5)" opacity="0.55"><PalmTree /></g>
        </svg>
      </motion.div>

      {/* 상세 모달 */}
      {modalSpot && (
        <SpotDetailModal spot={modalSpot} onClose={() => setModalSpot(null)} />
      )}
    </section>
  );
}
