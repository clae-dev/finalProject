import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCompanions } from '../../api/companion/useCompanion';
import { Loader2, Users, MapPin, Compass } from 'lucide-react';
import { getDday, getDdayStyle, formatTravelDate } from '../../lib/companionUtils';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400';

/* ─── 배경 캐릭터 SVG ─── */

// 배낭 멘 여행자 1 (모자 + 배낭)
function Traveler1() {
  return (
    <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
      <circle cx="25" cy="18" r="8" fill="#fcd34d" />
      <circle cx="23" cy="16.5" r="1.3" fill="#1e293b" />
      <circle cx="28" cy="16.5" r="1.3" fill="#1e293b" />
      <path d="M23,21 Q25,23 27,21" stroke="#1e293b" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="21" cy="19.5" r="2" fill="#fca5a5" opacity="0.5" />
      <circle cx="29" cy="19.5" r="2" fill="#fca5a5" opacity="0.5" />
      {/* 모자 */}
      <ellipse cx="25" cy="11" rx="10" ry="2.5" fill="#0ea5e9" />
      <rect x="19" y="6" width="12" height="5" rx="2.5" fill="#0ea5e9" />
      {/* 몸 */}
      <rect x="21" y="26" width="8" height="14" rx="4" fill="#f97316" />
      {/* 배낭 */}
      <rect x="11" y="24" width="10" height="14" rx="4" fill="#0284c7" />
      <rect x="13" y="27" width="6" height="4" rx="1.5" fill="#0369a1" opacity="0.5" />
      <line x1="16" y1="24" x2="16" y2="22" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="24" x2="22" y2="22" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
      {/* 팔 */}
      <line x1="22" y1="30" x2="16" y2="35" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
      <motion.line x1="28" y1="30" x2="34" y2="24"
        stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round"
        initial={{ x2: 34, y2: 24 }}
        animate={{ x2: [34, 36, 34], y2: [24, 26, 24] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* 다리 */}
      <line x1="23" y1="40" x2="21" y2="52" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="27" y1="40" x2="29" y2="52" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="20" cy="54" rx="4.5" ry="2.5" fill="#7c3aed" />
      <ellipse cx="30" cy="54" rx="4.5" ry="2.5" fill="#7c3aed" />
    </motion.g>
  );
}

// 카메라 든 여행자 2
function Traveler2() {
  return (
    <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}>
      <circle cx="25" cy="18" r="8" fill="#fcd34d" />
      <circle cx="23" cy="16.5" r="1.3" fill="#1e293b" />
      <circle cx="28" cy="16.5" r="1.3" fill="#1e293b" />
      <path d="M23,21 Q25,22.5 27,21" stroke="#1e293b" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="21" cy="19.5" r="2" fill="#fca5a5" opacity="0.5" />
      <circle cx="29" cy="19.5" r="2" fill="#fca5a5" opacity="0.5" />
      {/* 머리띠 */}
      <path d="M17,14 Q25,10 33,14" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* 몸 */}
      <rect x="21" y="26" width="8" height="14" rx="4" fill="#22d3ee" />
      {/* 카메라 */}
      <motion.g animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '38px 30px' }}>
        <rect x="33" y="26" width="12" height="9" rx="2" fill="#374151" />
        <circle cx="39" cy="30" r="3" fill="#1e293b" />
        <circle cx="39" cy="30" r="1.5" fill="#60a5fa" />
        <rect x="35" y="24" width="4" height="2" rx="1" fill="#374151" />
      </motion.g>
      {/* 팔 - 카메라 잡는 팔 */}
      <motion.line x1="28" y1="30" x2="34" y2="28"
        stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round"
        initial={{ x2: 34, y2: 28 }}
        animate={{ x2: [34, 35, 34], y2: [28, 29, 28] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <line x1="22" y1="30" x2="17" y2="36" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
      {/* 다리 */}
      <line x1="23" y1="40" x2="21" y2="52" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="27" y1="40" x2="29" y2="52" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="20" cy="54" rx="4.5" ry="2.5" fill="#f97316" />
      <ellipse cx="30" cy="54" rx="4.5" ry="2.5" fill="#f97316" />
    </motion.g>
  );
}

// 손 흔드는 여행자 3
function Traveler3() {
  return (
    <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}>
      <circle cx="25" cy="18" r="8" fill="#fcd34d" />
      <circle cx="23" cy="16" r="1.3" fill="#1e293b" />
      <circle cx="28" cy="16" r="1.3" fill="#1e293b" />
      <path d="M22,21 Q25,24 28,21" stroke="#1e293b" strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="19.5" r="2" fill="#fca5a5" opacity="0.5" />
      <circle cx="30" cy="19.5" r="2" fill="#fca5a5" opacity="0.5" />
      {/* 포니테일 */}
      <path d="M30,12 Q36,10 34,18" stroke="#92400e" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* 몸 (원피스) */}
      <path d="M19,26 L17,44 Q25,48 33,44 L31,26 Q25,23 19,26Z" fill="#a78bfa" />
      {/* 손 흔들기 */}
      <motion.line x1="30" y1="30" x2="40" y2="16"
        stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round"
        initial={{ x2: 40, y2: 16 }}
        animate={{ x2: [40, 38, 42, 40], y2: [16, 18, 14, 16] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <line x1="20" y1="30" x2="14" y2="36" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
      {/* 다리 */}
      <line x1="22" y1="44" x2="20" y2="55" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="28" y1="44" x2="30" y2="55" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="19" cy="57" rx="4.5" ry="2.5" fill="#ec4899" />
      <ellipse cx="31" cy="57" rx="4.5" ry="2.5" fill="#ec4899" />
    </motion.g>
  );
}

// 지도 보는 두 사람
function MapReaders() {
  return (
    <g>
      {/* 지도 */}
      <motion.rect x="22" y="40" width="20" height="15" rx="1" fill="#fef9c3" stroke="#d4a574" strokeWidth="0.8"
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '32px 47px' }}
      />
      <line x1="27" y1="44" x2="37" y2="44" stroke="#94a3b8" strokeWidth="0.5" />
      <line x1="27" y1="47" x2="35" y2="47" stroke="#94a3b8" strokeWidth="0.5" />
      <circle cx="32" cy="46" r="1.5" fill="#ef4444" opacity="0.6" />
      {/* 사람1 (왼쪽) */}
      <circle cx="18" cy="22" r="7" fill="#fcd34d" />
      <circle cx="16" cy="20.5" r="1.1" fill="#1e293b" />
      <circle cx="20" cy="20.5" r="1.1" fill="#1e293b" />
      <path d="M16,24 Q18,25.5 20,24" stroke="#1e293b" strokeWidth="0.7" fill="none" strokeLinecap="round" />
      <rect x="14.5" y="29" width="7" height="12" rx="3.5" fill="#38bdf8" />
      <line x1="20" y1="33" x2="24" y2="42" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
      <line x1="15.5" y1="33" x2="12" y2="40" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="41" x2="14" y2="52" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="19" y1="41" x2="21" y2="52" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="13.5" cy="54" rx="3.5" ry="2" fill="#3b82f6" />
      <ellipse cx="21.5" cy="54" rx="3.5" ry="2" fill="#3b82f6" />
      {/* 사람2 (오른쪽) */}
      <circle cx="46" cy="22" r="7" fill="#fcd34d" />
      <circle cx="44" cy="20.5" r="1.1" fill="#1e293b" />
      <circle cx="48" cy="20.5" r="1.1" fill="#1e293b" />
      <path d="M44,24 Q46,25.5 48,24" stroke="#1e293b" strokeWidth="0.7" fill="none" strokeLinecap="round" />
      <ellipse cx="46" cy="16" rx="9" ry="2" fill="#f97316" />
      <rect x="42" y="11" width="8" height="5" rx="2" fill="#f97316" />
      <rect x="42.5" y="29" width="7" height="12" rx="3.5" fill="#4ade80" />
      <line x1="43.5" y1="33" x2="40" y2="42" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
      <line x1="48" y1="33" x2="52" y2="40" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
      <line x1="44" y1="41" x2="42" y2="52" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="47" y1="41" x2="49" y2="52" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="41.5" cy="54" rx="3.5" ry="2" fill="#f97316" />
      <ellipse cx="49.5" cy="54" rx="3.5" ry="2" fill="#f97316" />
    </g>
  );
}

// 이정표
function Signpost() {
  return (
    <g>
      <rect x="18" y="20" width="4" height="60" rx="2" fill="#92400e" />
      <motion.g animate={{ rotate: [0, 1, -1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '20px 20px' }}>
        <rect x="5" y="15" width="30" height="12" rx="2" fill="#fbbf24" />
        <text x="12" y="24" fontSize="6" fill="#92400e" fontWeight="bold">제주</text>
        <rect x="8" y="30" width="26" height="12" rx="2" fill="#38bdf8" />
        <text x="12" y="39" fontSize="5.5" fill="white" fontWeight="bold">해변</text>
      </motion.g>
    </g>
  );
}

// 구름
function Cloud({ className, delay = 0, direction = 1 }) {
  return (
    <motion.svg className={className} viewBox="0 0 160 60" fill="white"
      animate={{ x: [0, 20 * direction, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <ellipse cx="55" cy="38" rx="40" ry="18" />
      <ellipse cx="90" cy="32" rx="32" ry="16" />
      <ellipse cx="70" cy="28" rx="28" ry="16" />
    </motion.svg>
  );
}

function CompanionsSection() {
  const navigate = useNavigate();
  const [companionSlide, setCompanionSlide] = useState(0);

  const { data, isLoading } = useCompanions(1, 9);
  const companions = data?.success ? (data.list || []) : [];

  const maxSlide = Math.max(0, companions.length - 3);
  const nextCompanion = () => setCompanionSlide(prev => Math.min(prev + 1, maxSlide));
  const prevCompanion = () => setCompanionSlide(prev => Math.max(prev - 1, 0));

  return (
    <section className="relative pt-24 pb-56 overflow-hidden">
      {/* 상단 페이드 - SpotsSection 모래사장에서 자연스럽게 녹아듦 */}
      <div className="absolute top-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-b from-[#fde68a]/40 via-[#bae6fd]/50 to-transparent z-[1]" />

      {/* 하늘 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-cyan-50 to-emerald-50/40" />

      {/* 구름 */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Cloud className="absolute top-4 left-[3%] w-32 md:w-40 opacity-70" delay={0} direction={1} />
        <Cloud className="absolute top-10 right-[8%] w-24 md:w-32 opacity-55" delay={2} direction={-1} />
        <Cloud className="absolute top-2 left-[45%] w-20 md:w-24 opacity-40" delay={5} direction={1} />
      </div>

      {/* 잔디 배경 장식 블러 */}
      <motion.div className="absolute top-20 left-[5%] w-44 h-44 bg-emerald-200/30 rounded-full blur-3xl"
        animate={{ y: [0, -15, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute bottom-40 right-[5%] w-56 h-56 bg-sky-200/30 rounded-full blur-3xl"
        animate={{ y: [0, 15, 0], opacity: [0.2, 0.4, 0.2] }}
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
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-sky-600 shadow-md shadow-sky-200/40 mb-5 border border-white/80"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="8" width="16" height="12" rx="3" fill="url(#bagGrad)" />
                <rect x="6" y="10" width="12" height="3" rx="1" fill="#0284c7" opacity="0.3" />
                <path d="M9,8 V6 Q9,4 12,4 Q15,4 15,6 V8" stroke="#0ea5e9" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <circle cx="12" cy="15" r="1.5" fill="white" />
                <defs>
                  <linearGradient id="bagGrad" x1="4" y1="8" x2="20" y2="20">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              동행 모집
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
              함께라서 더 <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">특별한</span>
            </h2>
            <p className="text-slate-400 mt-4 text-lg" style={{ fontFamily: "'Pretendard', sans-serif" }}>지금 모집 중인 동행에 참여해보세요</p>
          </div>
          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={prevCompanion} disabled={companionSlide === 0}
              className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg shadow-sky-100/60 flex items-center justify-center text-sky-500 hover:text-sky-600 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/80"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={nextCompanion} disabled={companionSlide >= maxSlide}
              className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg shadow-sky-100/60 flex items-center justify-center text-sky-500 hover:text-sky-600 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/80"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </motion.button>
          </div>
        </motion.div>

        {/* 카드 슬라이드 */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <Loader2 className="w-10 h-10 text-sky-400" />
            </motion.div>
          </div>
        )}

        {!isLoading && companions.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-sky-100"
            >
              <Users className="w-8 h-8 text-sky-500" />
            </motion.div>
            <p className="text-slate-400 text-lg font-medium">아직 모집 중인 동행이 없습니다</p>
          </motion.div>
        )}

        {!isLoading && companions.length > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <div className="flex gap-6 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${companionSlide * 340}px)` }}>
              {companions.map((comp, index) => {
                const dday = getDday(comp.travelDate);
                const tagList = comp.tags ? comp.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                return (
                  <motion.div key={comp.companionNo}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.5 }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    onClick={() => navigate(`/companions/${comp.companionNo}`)}
                    className="flex-shrink-0 w-80 bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg shadow-sky-100/50 hover:shadow-2xl hover:shadow-sky-200/60 transition-shadow duration-300 cursor-pointer group border border-white/60"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img src={comp.imageUrl || DEFAULT_IMAGE} alt=""
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                      {dday && (
                        <span className={`absolute top-4 right-4 px-3.5 py-1.5 backdrop-blur-sm rounded-full text-xs font-bold shadow-lg ${getDdayStyle(dday)}`}>{dday}</span>
                      )}
                      {comp.status === 'C' && (
                        <span className="absolute top-4 left-4 px-3.5 py-1.5 bg-red-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-white shadow-lg">마감</span>
                      )}
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        {tagList.slice(0, 3).map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-600 shadow-sm">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-800 text-lg mb-4 line-clamp-1 group-hover:text-sky-600 transition-colors duration-300">{comp.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-sky-200/50 overflow-hidden">
                            {comp.authorProfile ? (
                              <img src={comp.authorProfile} alt="" loading="lazy" className="w-full h-full object-cover" />
                            ) : (comp.authorNickname?.[0] || '?')}
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
            </div>
          </motion.div>
        )}

        {/* 더보기 */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/companions')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/90 backdrop-blur-sm text-sky-600 font-bold rounded-full shadow-lg shadow-sky-100/50 hover:shadow-xl border border-white/80 transition-all"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            동행 더보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </motion.button>
        </motion.div>
      </div>

      {/* ─── 하단 잔디밭 + 길 + 캐릭터 씬 ─── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        aria-hidden="true"
      >
        {/* 잔디 배경 */}
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 160" preserveAspectRatio="none">
          <path d="M0,35 Q180,12 360,28 Q540,45 720,22 Q900,8 1080,32 Q1260,50 1440,26 L1440,160 L0,160 Z" fill="#bbf7d0" opacity="0.5" />
          <path d="M0,55 Q200,42 400,52 Q600,65 800,48 Q1000,35 1200,55 Q1350,65 1440,50 L1440,160 L0,160 Z" fill="#86efac" opacity="0.35" />
          <path d="M0,80 Q300,68 600,78 Q900,88 1200,74 Q1380,66 1440,72 L1440,160 L0,160 Z" fill="#4ade80" opacity="0.2" />
          {/* 오솔길 */}
          <path d="M200,100 Q400,85 600,95 Q800,108 1000,90 Q1200,78 1400,92" stroke="#d4a574" strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.2" />
          <path d="M200,100 Q400,85 600,95 Q800,108 1000,90 Q1200,78 1400,92" stroke="#fde68a" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.15" strokeDasharray="2 12" />
        </svg>

        {/* 캐릭터들 */}
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 130" preserveAspectRatio="xMidYMax meet">
          {/* 이정표 */}
          <g transform="translate(60, 38)" opacity="0.7">
            <Signpost />
          </g>

          {/* 배낭 여행자 */}
          <g transform="translate(180, 62)" opacity="0.75">
            <Traveler1 />
          </g>

          {/* 카메라 여행자 */}
          <g transform="translate(350, 62)" opacity="0.75">
            <Traveler2 />
          </g>

          {/* 지도 보는 두 사람 */}
          <g transform="translate(540, 58)" opacity="0.7">
            <MapReaders />
          </g>

          {/* 나침반 아이콘 */}
          <motion.g transform="translate(730, 95)" opacity="0.5"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '12px 12px' }}
          >
            <circle cx="12" cy="12" r="10" fill="none" stroke="#0ea5e9" strokeWidth="1.5" />
            <polygon points="12,4 14,11 12,9 10,11" fill="#ef4444" />
            <polygon points="12,20 14,13 12,15 10,13" fill="#e2e8f0" />
          </motion.g>

          {/* 핀 마커 */}
          <g transform="translate(850, 85)" opacity="0.55">
            <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              <path d="M10,0 Q18,0 18,8 Q18,16 10,24 Q2,16 2,8 Q2,0 10,0Z" fill="#ef4444" />
              <circle cx="10" cy="8" r="3.5" fill="white" />
            </motion.g>
          </g>

          {/* 손 흔드는 여행자 */}
          <g transform="translate(940, 58)" opacity="0.75">
            <Traveler3 />
          </g>

          {/* 이정표 2 */}
          <g transform="translate(1100, 42)" opacity="0.6">
            <Signpost />
          </g>

          {/* 잔디 포인트 */}
          {[100, 280, 460, 640, 780, 880, 1020].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${108 + (i % 3) * 3})`} opacity="0.35">
              <line x1="0" y1="10" x2="2" y2="0" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="4" y1="10" x2="5" y2="2" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="8" y1="10" x2="7" y2="1" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      </motion.div>
    </section>
  );
}

export default React.memo(CompanionsSection);
