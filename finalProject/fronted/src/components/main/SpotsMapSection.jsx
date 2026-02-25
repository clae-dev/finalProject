import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, X, Phone, Navigation, ExternalLink, Copy, Check } from 'lucide-react';
import KakaoMap from '../common/KakaoMap';

/* ─── 추천 검색어 ─── */
const SUGGEST_KEYWORDS = ['흑돼지', '해물라면', '오름', '올레길', '감귤체험', '서핑'];

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
        <motion.path
          stroke="#c084fc" strokeWidth="1.5" fill="none"
          initial={{ d: "M58,24 Q61,32 56,36 Q61,40 57,45" }}
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
        initial={{ x2: 35, y2: 52 }}
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
        initial={{ x2: 12, y2: 36 }}
        animate={{ x2: [12, 10, 12], y2: [36, 38, 36] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.line x1="33" y1="52" x2="44" y2="36"
        stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round"
        initial={{ x2: 44, y2: 36 }}
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
      <motion.path stroke="#d4a574" strokeWidth="3.5" strokeLinecap="round" fill="none"
        initial={{ d: "M14,14 Q8,4 10,0" }}
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
      <motion.path
        stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"
        initial={{ d: "M0,12 Q10,2 20,10 Q30,2 40,12" }}
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

/* ─── 카테고리 목록 ─── */
const CATEGORIES = [
  { code: 'FD6', label: '맛집',   emoji: '🍜' },
  { code: 'CE7', label: '카페',   emoji: '☕' },
  { code: 'AT4', label: '관광명소', emoji: '🏖' },
  { code: 'AD5', label: '숙박',   emoji: '🏨' },
  { code: 'CT1', label: '문화시설', emoji: '🎭' },
];

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

/* ─── 검색 결과 상세 패널 ─── */
function PlaceDetailPanel({ place, onClose }) {
  const [copied, setCopied] = React.useState(false);
  const category = place.category_name ? place.category_name.split(' > ').slice(-1)[0] : '';
  const addr = place.road_address_name || place.address_name || '';

  const handleCopyAddress = () => {
    if (!addr) return;
    navigator.clipboard.writeText(addr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <motion.div
      key={place.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="mt-2 bg-white rounded-2xl border border-sky-200 shadow-lg overflow-hidden"
    >
      {/* 헤더 */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-[10px] font-bold text-sky-600">장소 상세정보</span>
            </div>
            <h4 className="font-black text-base text-slate-800 leading-tight" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
              {place.place_name}
            </h4>
            {category && (
              <span className="inline-block mt-1.5 text-[10px] font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                {category}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 정보 */}
      <div className="px-4 pb-3 space-y-2">
        {addr && (
          <div className="flex items-center gap-2.5 group">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-600 flex-1">{addr}</span>
            <button
              onClick={handleCopyAddress}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-slate-100"
              title="주소 복사"
            >
              {copied
                ? <Check className="w-3 h-3 text-green-500" />
                : <Copy className="w-3 h-3 text-slate-400" />
              }
            </button>
          </div>
        )}
        {place.address_name && place.road_address_name && (
          <div className="flex items-center gap-2.5 pl-6">
            <span className="text-[10px] text-slate-400">(지번) {place.address_name}</span>
          </div>
        )}
        {place.phone && (
          <div className="flex items-center gap-2.5">
            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <a href={`tel:${place.phone}`} className="text-xs text-sky-600 font-semibold hover:underline">
              {place.phone}
            </a>
          </div>
        )}
        {place.distance && (
          <div className="flex items-center gap-2.5">
            <Navigation className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-500">
              {Number(place.distance) >= 1000
                ? `${(Number(place.distance) / 1000).toFixed(1)}km`
                : `${place.distance}m`
              }
            </span>
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex border-t border-slate-100">
        <a
          href={`https://map.kakao.com/link/to/${encodeURIComponent(place.place_name)},${place.y},${place.x}`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-[#FEE500] hover:bg-[#FDD800] text-xs font-bold text-[#3C1E1E] transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" /> 길찾기
        </a>
        <a
          href={place.place_url}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-sky-500 hover:bg-sky-600 text-xs font-bold text-white transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" /> 카카오맵에서 보기
        </a>
      </div>
    </motion.div>
  );
}

/* ─── 메인 컴포넌트 ─── */
export default function SpotsMapSection() {
  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreResults, setHasMoreResults] = useState(false);

  // 맵 인스턴스 및 검색 마커 ref
  const mapInstanceRef = useRef(null);
  const searchMarkersRef = useRef([]);

  // 현재 열린 커스텀 오버레이 ref
  const activeOverlayRef = useRef(null);

  // 커스텀 오버레이 HTML 생성
  const buildOverlayContent = useCallback((place) => {
    const category = place.category_name ? place.category_name.split(' > ').slice(-1)[0] : '';
    const addr = place.road_address_name || place.address_name || '';
    return `
      <div style="
        position:relative;min-width:260px;max-width:320px;
        background:#fff;border-radius:16px;
        box-shadow:0 8px 30px rgba(0,0,0,.18);
        font-family:'Pretendard',sans-serif;overflow:hidden;
      ">
        <div style="padding:16px 16px 12px;">
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <div style="flex:1;min-width:0;">
              <div style="font-size:15px;font-weight:800;color:#1e293b;line-height:1.3;font-family:'GmarketSans',sans-serif;">
                ${place.place_name}
              </div>
              ${category ? `<span style="display:inline-block;margin-top:4px;padding:2px 8px;background:#f0f9ff;color:#0284c7;font-size:11px;font-weight:700;border-radius:20px;border:1px solid #e0f2fe;">${category}</span>` : ''}
            </div>
            <button onclick="this.closest('[data-overlay-wrap]').remove()" style="
              width:28px;height:28px;border-radius:50%;border:none;
              background:#f1f5f9;cursor:pointer;display:flex;align-items:center;justify-content:center;
              font-size:16px;color:#94a3b8;flex-shrink:0;
            ">&times;</button>
          </div>
          <div style="margin-top:10px;display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style="font-size:12px;color:#64748b;">${addr}</span>
            </div>
            ${place.phone ? `
            <div style="display:flex;align-items:center;gap:6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <a href="tel:${place.phone}" style="font-size:12px;color:#0284c7;text-decoration:none;font-weight:600;">${place.phone}</a>
            </div>` : ''}
          </div>
        </div>
        <div style="display:flex;border-top:1px solid #f1f5f9;">
          <a href="https://map.kakao.com/link/to/${encodeURIComponent(place.place_name)},${place.y},${place.x}"
             target="_blank" rel="noopener noreferrer"
             style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;
                    padding:10px;font-size:12px;font-weight:700;color:#3C1E1E;
                    background:#FEE500;text-decoration:none;border-bottom-left-radius:16px;
                    transition:background .15s;"
             onmouseover="this.style.background='#FDD800'" onmouseout="this.style.background='#FEE500'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            길찾기
          </a>
          <a href="${place.place_url}" target="_blank" rel="noopener noreferrer"
             style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;
                    padding:10px;font-size:12px;font-weight:700;color:#fff;
                    background:#0ea5e9;text-decoration:none;border-bottom-right-radius:16px;
                    transition:background .15s;"
             onmouseover="this.style.background='#0284c7'" onmouseout="this.style.background='#0ea5e9'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            상세보기
          </a>
        </div>
        <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);
                     width:16px;height:16px;background:#fff;
                     transform:translateX(-50%) rotate(45deg);
                     box-shadow:4px 4px 8px rgba(0,0,0,.08);"></div>
      </div>
    `;
  }, []);

  // 검색 마커 추가 헬퍼
  const addSearchMarkers = useCallback((places, fitBounds = true) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const bounds = fitBounds ? new window.kakao.maps.LatLngBounds() : null;

    places.forEach((place) => {
      const pos = new window.kakao.maps.LatLng(Number(place.y), Number(place.x));
      const marker = new window.kakao.maps.Marker({ position: pos, map });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        // 기존 오버레이 닫기
        if (activeOverlayRef.current) activeOverlayRef.current.setMap(null);

        const wrap = document.createElement('div');
        wrap.setAttribute('data-overlay-wrap', '');
        wrap.innerHTML = buildOverlayContent(place);

        // 닫기 버튼 이벤트 재연결 (innerHTML 후)
        const closeBtn = wrap.querySelector('button');
        if (closeBtn) {
          closeBtn.onclick = () => {
            overlay.setMap(null);
            activeOverlayRef.current = null;
          };
        }

        const overlay = new window.kakao.maps.CustomOverlay({
          content: wrap,
          position: pos,
          yAnchor: 1.15,
          zIndex: 10,
        });
        overlay.setMap(map);
        activeOverlayRef.current = overlay;

        map.panTo(pos);
        setSelectedResult(place);
      });

      searchMarkersRef.current.push(marker);
      if (bounds) bounds.extend(pos);
    });

    if (bounds && places.length > 0) map.setBounds(bounds, 60);
  }, [buildOverlayContent]);

  // 검색 실행 (page 파라미터로 페이지네이션, keyword로 직접 검색어 전달 가능)
  const handleSearch = useCallback((page = 1, keyword) => {
    const q = (keyword || searchQuery).trim();
    if (!q || !mapInstanceRef.current || !window.kakao?.maps?.services?.Places) return;
    if (keyword) setSearchQuery(keyword);

    setIsSearching(true);
    const ps = new window.kakao.maps.services.Places();

    ps.keywordSearch(
      q,
      (data, status, pagination) => {
        setIsSearching(false);
        if (status !== window.kakao.maps.services.Status.OK) {
          if (page === 1) setSearchResults([]);
          setHasMoreResults(false);
          return;
        }

        if (page === 1) {
          searchMarkersRef.current.forEach(m => m.setMap(null));
          searchMarkersRef.current = [];
          addSearchMarkers(data, true);
          setSearchResults(data);
        } else {
          addSearchMarkers(data, false);
          setSearchResults(prev => [...prev, ...data]);
        }

        setSearchPage(page);
        setHasMoreResults(pagination.hasNextPage);

        setSelectedResult(null);
      },
      {
        rect: '126.08,33.10,127.00,33.62',
        page,
      }
    );
  }, [searchQuery, addSearchMarkers]);

  // 더보기
  const handleLoadMore = useCallback(() => {
    handleSearch(searchPage + 1);
  }, [handleSearch, searchPage]);

  // 검색 초기화
  const clearSearch = useCallback(() => {
    searchMarkersRef.current.forEach(m => m.setMap(null));
    searchMarkersRef.current = [];
    if (activeOverlayRef.current) { activeOverlayRef.current.setMap(null); activeOverlayRef.current = null; }
    setSearchResults([]);

    setSearchQuery('');
    setSelectedResult(null);
    setActiveCategory(null);
    setSearchPage(1);
    setHasMoreResults(false);
  }, []);

  // 카테고리 검색
  const handleCategorySearch = useCallback((code) => {
    if (!mapInstanceRef.current || !window.kakao?.maps?.services?.Places) return;

    // 같은 카테고리 재클릭 시 초기화
    if (activeCategory === code) { clearSearch(); return; }

    setActiveCategory(code);
    setIsSearching(true);
    setSearchQuery('');

    const ps = new window.kakao.maps.services.Places();
    ps.categorySearch(
      code,
      (data, status) => {
        setIsSearching(false);
        if (status !== window.kakao.maps.services.Status.OK) {
          setSearchResults([]);
          return;
        }

        searchMarkersRef.current.forEach(m => m.setMap(null));
        searchMarkersRef.current = [];

        addSearchMarkers(data, true);
        setSearchResults(data);

        setSelectedResult(null);
        setHasMoreResults(false);
      },
      {
        rect: '126.08,33.10,127.00,33.62',
        sort: window.kakao.maps.services.SortBy.ACCURACY,
      }
    );
  }, [activeCategory, clearSearch, addSearchMarkers]);

  // 검색 결과 클릭 시 지도 이동 + 커스텀 오버레이
  const handleResultClick = useCallback((place) => {
    setSelectedResult(place);
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const pos = new window.kakao.maps.LatLng(Number(place.y), Number(place.x));
    map.panTo(pos);

    // 기존 오버레이 닫기
    if (activeOverlayRef.current) activeOverlayRef.current.setMap(null);

    const wrap = document.createElement('div');
    wrap.setAttribute('data-overlay-wrap', '');
    wrap.innerHTML = buildOverlayContent(place);

    const overlay = new window.kakao.maps.CustomOverlay({
      content: wrap,
      position: pos,
      yAnchor: 1.15,
      zIndex: 10,
    });

    const closeBtn = wrap.querySelector('button');
    if (closeBtn) {
      closeBtn.onclick = () => {
        overlay.setMap(null);
        activeOverlayRef.current = null;
      };
    }

    overlay.setMap(map);
    activeOverlayRef.current = overlay;
  }, [buildOverlayContent]);

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
            혼행러들이 궁금해하는{' '}
            <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
              제주도
            </span>
          </h2>
          <p className="text-slate-500 mt-3 text-base" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            제주도의 맛집, 카페, 관광지를 자유롭게 검색해보세요
          </p>
        </motion.div>

        {/* ─── 통합 검색 카드 ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-sky-200/30 border border-white/80 overflow-hidden"
        >
          {/* 상단: 검색바 + 카테고리 */}
          <div className="px-5 pt-5 pb-4 border-b border-sky-50 space-y-3">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSearch(1); }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="맛집, 카페, 관광지, 주소 검색..."
                  className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition-all"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={!searchQuery.trim() || isSearching}
                className="px-5 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-bold rounded-2xl transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                검색
              </button>
              {searchResults.length > 0 && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 text-sm font-bold rounded-2xl transition-colors flex-shrink-0"
                  title="초기화"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* 카테고리 + 추천 검색어 */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
              {CATEGORIES.map(({ code, label, emoji }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleCategorySearch(code)}
                  disabled={isSearching}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold border flex-shrink-0 transition-all ${
                    activeCategory === code
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200'
                  }`}
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              ))}
              <div className="w-px h-5 bg-slate-200 flex-shrink-0 mx-1" />
              {SUGGEST_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  onClick={() => handleSearch(1, kw)}
                  className="px-3 py-2 bg-sky-50/80 hover:bg-sky-100 text-[11px] font-semibold text-sky-500 rounded-full border border-sky-100/80 hover:border-sky-200 transition-all flex-shrink-0"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* 메인: 지도 + 결과 패널 */}
          <div className="relative">
            {/* 지도 (항상 전체 너비) */}
            <div className="p-3">
              <KakaoMap
                lat={33.3617}
                lng={126.5292}
                level={10}
                height="520px"
                onMapReady={(map) => { mapInstanceRef.current = map; }}
              />
            </div>

            {/* 검색 결과 없을 때: 지도 위 안내 오버레이 */}
            {searchResults.length === 0 && !isSearching && (
              <div className="absolute top-6 left-6 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg px-5 py-4 border border-white/80 pointer-events-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Search className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
                        제주도 어디든 검색해보세요
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">위 검색창에 장소를 입력하거나 카테고리를 선택하세요</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 검색 결과 있을 때: 좌측 플로팅 패널 */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-5 left-5 bottom-5 w-[320px] hidden lg:flex flex-col bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/80 overflow-hidden z-[5]"
                >
                  {/* 패널 헤더 */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-gradient-to-b from-sky-400 to-cyan-400 rounded-full" />
                      <span className="text-sm font-bold text-slate-700">
                        검색 결과 <span className="text-sky-500">{searchResults.length}</span>곳
                      </span>
                    </div>
                    <button
                      onClick={clearSearch}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-3 h-3" /> 닫기
                    </button>
                  </div>

                  {/* 스크롤 가능한 결과 리스트 */}
                  <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-hide">
                    {searchResults.map((place, idx) => (
                      <motion.div
                        key={`${place.id}-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                      >
                        <SearchResultCard
                          place={place}
                          selected={selectedResult?.id === place.id}
                          onClick={() => handleResultClick(place)}
                        />
                      </motion.div>
                    ))}
                    {hasMoreResults && (
                      <button
                        onClick={handleLoadMore}
                        disabled={isSearching}
                        className="w-full py-2.5 text-xs font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 transition-colors flex items-center justify-center gap-2 mt-1"
                      >
                        {isSearching ? (
                          <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>더보기</>
                        )}
                      </button>
                    )}
                  </div>

                  {/* 선택된 장소 상세정보 */}
                  <AnimatePresence mode="wait">
                    {selectedResult && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex-shrink-0 border-t border-sky-100 overflow-hidden"
                      >
                        <PlaceDetailPanel place={selectedResult} onClose={() => setSelectedResult(null)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 모바일: 하단 결과 시트 */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="lg:hidden mt-0 p-3 pt-0"
                >
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-white/80 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <span className="text-sm font-bold text-slate-700">
                        검색 결과 <span className="text-sky-500">{searchResults.length}</span>곳
                      </span>
                      <button
                        onClick={clearSearch}
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" /> 초기화
                      </button>
                    </div>
                    <div className="max-h-[280px] overflow-y-auto p-2.5 space-y-1.5 scrollbar-hide">
                      {searchResults.map((place, idx) => (
                        <SearchResultCard
                          key={`${place.id}-${idx}`}
                          place={place}
                          selected={selectedResult?.id === place.id}
                          onClick={() => handleResultClick(place)}
                        />
                      ))}
                      {hasMoreResults && (
                        <button
                          onClick={handleLoadMore}
                          disabled={isSearching}
                          className="w-full py-2.5 text-xs font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 transition-colors flex items-center justify-center gap-2"
                        >
                          {isSearching ? (
                            <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>더보기</>
                          )}
                        </button>
                      )}
                    </div>
                    <AnimatePresence mode="wait">
                      {selectedResult && (
                        <PlaceDetailPanel place={selectedResult} onClose={() => setSelectedResult(null)} />
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* ─── 파도 애니메이션 ─── */}
      <div className="absolute bottom-40 left-0 right-0 h-24 pointer-events-none overflow-hidden z-[1]" aria-hidden="true">
        <motion.svg className="absolute bottom-0 w-[110%] -left-[5%] h-full"
          viewBox="0 0 1440 80" preserveAspectRatio="none"
          animate={{ x: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
          <motion.path fill="#bae6fd" opacity="0.4"
            initial={{ d: "M0,50 Q120,30 240,45 Q360,60 480,42 Q600,25 720,48 Q840,65 960,40 Q1080,20 1200,50 Q1320,65 1440,45 L1440,80 L0,80 Z" }}
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
            initial={{ d: "M0,55 Q180,35 360,52 Q540,68 720,45 Q900,28 1080,55 Q1260,68 1440,48 L1440,80 L0,80 Z" }}
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
            initial={{ d: "M0,62 Q100,48 200,58 Q300,68 400,55 Q500,42 600,60 Q700,70 800,52 Q900,40 1000,58 Q1100,68 1200,54 Q1300,42 1440,60 L1440,80 L0,80 Z" }}
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
            initial={{ d: "M0,0 Q180,12 360,5 Q540,15 720,3 Q900,14 1080,6 Q1260,16 1440,4 L1440,30 L0,30 Z" }}
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

    </section>
  );
}
