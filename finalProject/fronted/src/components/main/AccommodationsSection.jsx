import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useAccommodations } from '../../api/accommodation/useAccommodation';
import { useCreateAccommodation } from '../../api/admin/useAdmin';
import AccommodationFormModal from '../accommodation/AccommodationFormModal';
import { AuthContext } from '../AuthContext';
import { Loader2, MapPin, Heart, Plus } from 'lucide-react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500';

function formatPrice(priceMin, priceMax) {
  if (!priceMin && !priceMax) return '가격 문의';
  if (priceMin && priceMax) return `${(priceMin / 10000).toFixed(0)}~${(priceMax / 10000).toFixed(0)}만원`;
  if (priceMin) return `${(priceMin / 10000).toFixed(0)}만원~`;
  return `~${(priceMax / 10000).toFixed(0)}만원`;
}

/* ─── 시골 풍경 SVG 캐릭터 ─── */

// 초가집 / 펜션
function Cottage({ isInView = true }) {
  return (
    <g>
      {/* 지붕 */}
      <path d="M5,45 L30,18 L55,45" fill="#d97706" />
      <path d="M8,45 L30,22 L52,45" fill="#f59e0b" />
      {/* 벽 */}
      <rect x="14" y="45" width="32" height="28" fill="#fef3c7" />
      <rect x="14" y="45" width="32" height="28" fill="none" stroke="#d97706" strokeWidth="0.5" opacity="0.3" />
      {/* 문 */}
      <rect x="24" y="55" width="12" height="18" rx="6" fill="#92400e" />
      <circle cx="33" cy="65" r="1" fill="#fbbf24" />
      {/* 창문 */}
      <rect x="17" y="50" width="5" height="5" rx="0.5" fill="#bae6fd" stroke="#d97706" strokeWidth="0.5" />
      <line x1="19.5" y1="50" x2="19.5" y2="55" stroke="#d97706" strokeWidth="0.4" />
      <line x1="17" y1="52.5" x2="22" y2="52.5" stroke="#d97706" strokeWidth="0.4" />
      <rect x="38" y="50" width="5" height="5" rx="0.5" fill="#bae6fd" stroke="#d97706" strokeWidth="0.5" />
      <line x1="40.5" y1="50" x2="40.5" y2="55" stroke="#d97706" strokeWidth="0.4" />
      <line x1="38" y1="52.5" x2="43" y2="52.5" stroke="#d97706" strokeWidth="0.4" />
      {/* 굴뚝 */}
      <rect x="40" y="22" width="6" height="16" fill="#78716c" />
      <motion.g
        animate={isInView ? { y: [0, -6, -12], opacity: [0.4, 0.2, 0] } : { y: 0, opacity: 0.4 }}
        transition={{ duration: 3, repeat: isInView ? Infinity : 0, ease: 'easeOut' }}>
        <circle cx="43" cy="20" r="3" fill="#d1d5db" opacity="0.5" />
        <circle cx="46" cy="16" r="2" fill="#d1d5db" opacity="0.3" />
      </motion.g>
    </g>
  );
}

// 큰 나무
function BigTree({ flip = false, isInView = true }) {
  return (
    <g transform={flip ? 'scale(-1,1) translate(-40,0)' : ''}>
      <rect x="17" y="40" width="6" height="40" rx="3" fill="#92400e" />
      <motion.g
        animate={isInView ? { rotate: [0, 1.5, -1, 0] } : { rotate: 0 }}
        transition={{ duration: 5, repeat: isInView ? Infinity : 0, ease: 'easeInOut' }}
        style={{ transformOrigin: '20px 40px' }}>
        <ellipse cx="20" cy="28" rx="18" ry="20" fill="#22c55e" />
        <ellipse cx="14" cy="24" rx="10" ry="12" fill="#16a34a" opacity="0.6" />
        <ellipse cx="28" cy="22" rx="9" ry="11" fill="#15803d" opacity="0.4" />
      </motion.g>
    </g>
  );
}

// 울타리
function Fence({ width = 80 }) {
  const posts = Math.floor(width / 12);
  return (
    <g>
      {Array.from({ length: posts }).map((_, i) => (
        <g key={i}>
          <rect x={i * 12} y="2" width="3" height="20" rx="1" fill="#d4a574" />
          <polygon points={`${i * 12},2 ${i * 12 + 1.5},-2 ${i * 12 + 3},2`} fill="#c2956a" />
        </g>
      ))}
      <rect x="0" y="7" width={width} height="2.5" rx="1" fill="#c2956a" />
      <rect x="0" y="14" width={width} height="2.5" rx="1" fill="#c2956a" />
    </g>
  );
}

// 산책하는 가족 (엄마 + 아이)
function FamilyWalk({ isInView = true }) {
  return (
    <g>
      {/* 엄마 */}
      <motion.g
        animate={isInView ? { y: [0, -2, 0] } : { y: 0 }}
        transition={{ duration: 1.5, repeat: isInView ? Infinity : 0, ease: 'easeInOut' }}>
        <circle cx="15" cy="12" r="7" fill="#fcd34d" />
        <circle cx="13" cy="10.5" r="1.1" fill="#1e293b" />
        <circle cx="17" cy="10.5" r="1.1" fill="#1e293b" />
        <path d="M13,14 Q15,15.5 17,14" stroke="#1e293b" strokeWidth="0.7" fill="none" strokeLinecap="round" />
        <path d="M20,8 Q24,6 22,14" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M8,20 L6,40 Q15,44 24,40 L22,20 Q15,17 8,20Z" fill="#f472b6" />
        <line x1="9" y1="24" x2="4" y2="32" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
        <motion.line x1="21" y1="24" x2="30" y2="28"
          stroke="#fcd34d" strokeWidth="3" strokeLinecap="round"
          initial={{ x2: 30, y2: 28 }}
          animate={isInView ? { x2: [30, 32, 30], y2: [28, 26, 28] } : { x2: 30, y2: 28 }}
          transition={{ duration: 1, repeat: isInView ? Infinity : 0, ease: 'easeInOut' }}
        />
        <line x1="11" y1="40" x2="9" y2="52" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        <line x1="19" y1="40" x2="21" y2="52" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="8.5" cy="54" rx="4" ry="2" fill="#ec4899" />
        <ellipse cx="21.5" cy="54" rx="4" ry="2" fill="#ec4899" />
      </motion.g>
      {/* 아이 (손잡고) */}
      <motion.g
        animate={isInView ? { y: [0, -3, 0] } : { y: 0 }}
        transition={{ duration: 1, repeat: isInView ? Infinity : 0, ease: 'easeInOut', delay: 0.2 }}>
        <circle cx="38" cy="22" r="5.5" fill="#fcd34d" />
        <circle cx="36.5" cy="21" r="1" fill="#1e293b" />
        <circle cx="39.5" cy="21" r="1" fill="#1e293b" />
        <path d="M37,24 Q38,25.5 39,24" stroke="#1e293b" strokeWidth="0.6" fill="none" strokeLinecap="round" />
        <circle cx="35" cy="23" r="1.5" fill="#fca5a5" opacity="0.5" />
        <circle cx="41" cy="23" r="1.5" fill="#fca5a5" opacity="0.5" />
        <rect x="34.5" y="28" width="7" height="10" rx="3.5" fill="#60a5fa" />
        <line x1="35" y1="31" x2="30" y2="28" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="41" y1="31" x2="44" y2="36" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="38" x2="34" y2="47" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="38" x2="42" y2="47" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="33.5" cy="48.5" rx="3" ry="1.8" fill="#3b82f6" />
        <ellipse cx="42.5" cy="48.5" rx="3" ry="1.8" fill="#3b82f6" />
      </motion.g>
    </g>
  );
}

// 꽃밭
function Flowers({ count = 5, isInView = true }) {
  const colors = ['#f472b6', '#fb923c', '#facc15', '#a78bfa', '#f87171'];
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => (
        <motion.g key={i} transform={`translate(${i * 14}, 0)`}
          animate={isInView ? { rotate: [0, 3, -3, 0] } : { rotate: 0 }}
          transition={{ duration: 2 + i * 0.3, repeat: isInView ? Infinity : 0, ease: 'easeInOut', delay: i * 0.2 }}
          style={{ transformOrigin: `${i * 14 + 5}px 16px` }}
        >
          <line x1="5" y1="8" x2="5" y2="18" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="5" cy="6" r="4" fill={colors[i % colors.length]} />
          <circle cx="5" cy="6" r="1.5" fill="#fbbf24" />
        </motion.g>
      ))}
    </g>
  );
}

// 나비
function Butterfly({ delay = 0, isInView = true }) {
  return (
    <motion.g
      animate={isInView ? { x: [0, 20, 5, 25, 0], y: [0, -10, -5, -15, 0] } : { x: 0, y: 0 }}
      transition={{ duration: 6, repeat: isInView ? Infinity : 0, ease: 'easeInOut', delay }}
    >
      <motion.g
        animate={isInView ? { scaleX: [1, 0.3, 1] } : { scaleX: 1 }}
        transition={{ duration: 0.4, repeat: isInView ? Infinity : 0, ease: 'easeInOut' }}
        style={{ transformOrigin: '8px 5px' }}
      >
        <ellipse cx="4" cy="3" rx="4" ry="3" fill="#c084fc" opacity="0.7" />
        <ellipse cx="12" cy="3" rx="4" ry="3" fill="#c084fc" opacity="0.7" />
        <ellipse cx="4" cy="7" rx="3" ry="2.5" fill="#e879f9" opacity="0.6" />
        <ellipse cx="12" cy="7" rx="3" ry="2.5" fill="#e879f9" opacity="0.6" />
        <ellipse cx="8" cy="5" rx="1" ry="4" fill="#1e293b" />
      </motion.g>
    </motion.g>
  );
}

// 구름
function Cloud({ className, delay = 0, direction = 1, isInView = true }) {
  return (
    <motion.svg className={className} viewBox="0 0 160 60" fill="white"
      animate={isInView ? { x: [0, 20 * direction, 0] } : { x: 0 }}
      transition={{ duration: 16, repeat: isInView ? Infinity : 0, ease: 'easeInOut', delay }}>
      <ellipse cx="55" cy="38" rx="42" ry="18" />
      <ellipse cx="90" cy="32" rx="34" ry="16" />
      <ellipse cx="70" cy="26" rx="28" ry="16" />
    </motion.svg>
  );
}

// 산
function Mountains() {
  return (
    <g>
      <path d="M0,100 L80,20 L160,100" fill="#86efac" opacity="0.3" />
      <path d="M60,100 L160,35 L260,100" fill="#4ade80" opacity="0.25" />
      <path d="M180,100 L250,40 L320,100" fill="#86efac" opacity="0.2" />
    </g>
  );
}

function AccommodationsSection() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: '100px' });

  const { user } = useContext(AuthContext);
  const isAdmin = user && user.memberRole === 'A';
  const createAccom = useCreateAccommodation();

  const { data, isLoading } = useAccommodations(1, 9);
  const accommodations = data?.success ? (data.list || []) : [];

  const maxSlide = Math.max(0, accommodations.length - 3);
  const nextSlide = () => setSlide(prev => Math.min(prev + 1, maxSlide));
  const prevSlide = () => setSlide(prev => Math.max(prev - 1, 0));

  return (
    <section ref={sectionRef} className="relative pt-24 pb-56 overflow-hidden">
      {/* 상단 페이드 - CompanionsSection 잔디에서 자연스럽게 녹아듦 */}
      <div className="absolute top-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-b from-[#bbf7d0]/40 via-[#fef3c7]/50 to-transparent z-[1]" />

      {/* 하늘 배경 (저녁노을 느낌) */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100/80 via-orange-50/40 to-emerald-50/30" />

      {/* 구름 */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Cloud className="absolute top-3 left-[5%] w-32 md:w-40 opacity-70" delay={0} direction={1} />
        <Cloud className="absolute top-8 right-[10%] w-24 md:w-32 opacity-50" delay={3} direction={-1} />
        <Cloud className="absolute top-1 left-[50%] w-20 md:w-24 opacity-40" delay={6} direction={1} />
      </div>

      {/* 블러 장식 */}
      <motion.div className="absolute top-16 left-[8%] w-40 h-40 bg-amber-200/30 rounded-full blur-3xl"
        animate={{ y: [0, -12, 0], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute bottom-40 right-[8%] w-48 h-48 bg-green-200/25 rounded-full blur-3xl"
        animate={{ y: [0, 12, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-6xl mx-auto px-5 relative z-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-amber-600 shadow-md shadow-amber-200/40 mb-5 border border-white/80"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M3,21 L3,10 L12,3 L21,10 L21,21 Z" fill="url(#homeGrad)" />
                <rect x="9" y="14" width="6" height="7" rx="1" fill="#92400e" />
                <rect x="5" y="12" width="4" height="3.5" rx="0.5" fill="#fef3c7" stroke="#d97706" strokeWidth="0.4" />
                <rect x="15" y="12" width="4" height="3.5" rx="0.5" fill="#fef3c7" stroke="#d97706" strokeWidth="0.4" />
                <defs>
                  <linearGradient id="homeGrad" x1="3" y1="3" x2="21" y2="21">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
              </svg>
              STAY
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 font-gmarket">
              혼행에 딱 맞는 <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">숙소</span>
            </h2>
            <p className="text-slate-400 mt-4 text-lg font-pretendard">파도 소리와 함께,<br />나만의 시간</p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setAddModalOpen(true)}
                className="flex items-center gap-1.5 px-5 py-3 bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all border border-white/30 font-pretendard"
              >
                <Plus className="w-4 h-4" />
                숙소 추가
              </motion.button>
            )}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={prevSlide} disabled={slide === 0}
              className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg shadow-amber-100/60 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/80"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={nextSlide} disabled={slide >= maxSlide}
              className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg shadow-amber-100/60 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/80"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </motion.button>
          </div>
        </motion.div>

        {/* 카드 슬라이드 */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <Loader2 className="w-10 h-10 text-amber-400" />
            </motion.div>
          </div>
        )}

        {!isLoading && accommodations.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-100"
            >
              <span className="text-3xl">🏠</span>
            </motion.div>
            <p className="text-slate-400 text-lg font-medium">등록된 숙소가 없습니다</p>
          </motion.div>
        )}

        {!isLoading && accommodations.length > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }} className="overflow-hidden">
            <div className="flex gap-7 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${slide * 340}px)` }}>
              {accommodations.map((acc, index) => (
                <motion.div key={acc.accommodationNo}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.5 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  onClick={() => navigate(`/accommodations/${acc.accommodationNo}`)}
                  className="flex-shrink-0 w-80 group cursor-pointer"
                >
                  <div className="relative rounded-3xl overflow-hidden mb-5 shadow-lg shadow-amber-100/40 group-hover:shadow-2xl group-hover:shadow-amber-200/50 transition-shadow duration-500">
                    <div className="aspect-[4/3]">
                      <img src={acc.thumbnailUrl || DEFAULT_IMAGE} alt={acc.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <button onClick={(e) => e.stopPropagation()}
                      className="absolute top-4 right-4 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform">
                      <Heart className="w-5 h-5 text-slate-300 hover:text-rose-500 transition-colors" />
                    </button>
                    {acc.accommodationType && (
                      <div className="absolute bottom-4 left-4">
                        <span className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm font-bold text-amber-600 shadow-lg border border-white/60">{acc.accommodationType}</span>
                      </div>
                    )}
                  </div>
                  <div className="px-2">
                    <h3 className="font-bold text-slate-800 text-lg line-clamp-1 mb-2 group-hover:text-amber-600 transition-colors duration-300">{acc.name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="line-clamp-1">{acc.address || acc.region || ''}</span>
                    </div>
                    <p className="text-xl font-black text-slate-800">
                      {formatPrice(acc.priceMin, acc.priceMax)}
                      <span className="text-sm font-normal text-slate-400 ml-1">/ 박</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 더보기 */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/accommodations')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/90 backdrop-blur-sm text-amber-600 font-bold rounded-full shadow-lg shadow-amber-100/50 hover:shadow-xl border border-white/80 transition-all font-pretendard"
          >
            숙소 더보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </motion.button>
        </motion.div>
      </div>

      {/* ─── 하단 시골 전경 풍경 ─── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        aria-hidden="true"
      >
        {/* 산 배경 */}
        <svg className="absolute bottom-24 w-full h-28" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,100 L120,40 L280,80 L400,30 L560,70 L720,20 L880,65 L1040,25 L1200,60 L1360,35 L1440,55 L1440,100 L0,100 Z" fill="#86efac" opacity="0.25" />
          <path d="M0,100 L200,55 L380,80 L520,45 L700,75 L880,40 L1060,70 L1240,50 L1440,65 L1440,100 L0,100 Z" fill="#4ade80" opacity="0.15" />
        </svg>

        {/* 잔디 바닥 */}
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 170" preserveAspectRatio="none">
          <path d="M0,50 Q180,25 360,42 Q540,60 720,35 Q900,18 1080,45 Q1260,62 1440,38 L1440,170 L0,170 Z" fill="#bbf7d0" opacity="0.6" />
          <path d="M0,75 Q200,58 400,70 Q600,85 800,65 Q1000,50 1200,72 Q1350,82 1440,68 L1440,170 L0,170 Z" fill="#86efac" opacity="0.4" />
          <path d="M0,100 Q300,88 600,96 Q900,108 1200,92 Q1380,86 1440,90 L1440,170 L0,170 Z" fill="#4ade80" opacity="0.25" />
          {/* 시골 돌담길 */}
          <path d="M100,120 Q350,108 600,118 Q850,130 1100,115 Q1300,105 1440,118" stroke="#a8a29e" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.15" strokeDasharray="4 8" />
        </svg>

        {/* 캐릭터 + 풍경 */}
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 140" preserveAspectRatio="xMidYMax meet">
          {/* 큰 나무 왼쪽 */}
          <g transform="translate(30, 40)" opacity="0.6">
            <BigTree />
          </g>

          {/* 울타리 */}
          <g transform="translate(100, 105)" opacity="0.4">
            <Fence width={90} />
          </g>

          {/* 초가집 */}
          <g transform="translate(220, 55)" opacity="0.65">
            <Cottage />
          </g>

          {/* 꽃밭 */}
          <g transform="translate(310, 108)" opacity="0.6">
            <Flowers count={5} />
          </g>

          {/* 나비 1 */}
          <g transform="translate(340, 80)" opacity="0.6">
            <Butterfly delay={0} />
          </g>

          {/* 산책하는 가족 */}
          <g transform="translate(460, 72)" opacity="0.75">
            <FamilyWalk />
          </g>

          {/* 꽃밭 2 */}
          <g transform="translate(560, 110)" opacity="0.55">
            <Flowers count={4} />
          </g>

          {/* 나비 2 */}
          <g transform="translate(620, 75)" opacity="0.5">
            <Butterfly delay={2} />
          </g>

          {/* 울타리 2 */}
          <g transform="translate(660, 108)" opacity="0.35">
            <Fence width={100} />
          </g>

          {/* 큰 나무 중간 */}
          <g transform="translate(810, 42)" opacity="0.55">
            <BigTree flip />
          </g>

          {/* 초가집 2 */}
          <g transform="translate(890, 58)" opacity="0.6">
            <Cottage />
          </g>

          {/* 꽃밭 3 */}
          <g transform="translate(980, 112)" opacity="0.5">
            <Flowers count={4} />
          </g>

          {/* 큰 나무 오른쪽 */}
          <g transform="translate(1080, 38)" opacity="0.5">
            <BigTree />
          </g>

          {/* 나비 3 */}
          <g transform="translate(1020, 70)" opacity="0.45">
            <Butterfly delay={4} />
          </g>

          {/* 잔디 포인트 */}
          {[50, 150, 400, 540, 700, 850, 1000, 1120].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${118 + (i % 3) * 3})`} opacity="0.3">
              <line x1="0" y1="10" x2="1.5" y2="0" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="4" y1="10" x2="5" y2="1" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="8" y1="10" x2="7" y2="2" stroke="#15803d" strokeWidth="1.3" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* 관리자 숙소 추가 모달 */}
      {isAdmin && (
        <AccommodationFormModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          editTarget={null}
          isPending={createAccom.isPending}
          onSubmit={(formData) => {
            createAccom.mutate(formData, {
              onSuccess: (res) => {
                if (res?.success) {
                  setAddModalOpen(false);
                } else {
                  alert(res?.message || '추가 실패');
                }
              },
            });
          }}
        />
      )}
    </section>
  );
}

export default React.memo(AccommodationsSection);
