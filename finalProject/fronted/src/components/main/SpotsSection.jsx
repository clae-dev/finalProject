import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveSpots } from '../../api/spot/useSpot';

const DEFAULT_SPOTS = [
  { spotNo: 1, spotTitle: '월정리 해변', spotDesc: '에메랄드빛 투명한 바다', spotLocation: '제주시 구좌읍 월정리', spotImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', spotTag: '🔥 인기', spotSize: 'large' },
  { spotNo: 2, spotTitle: '협재해수욕장', spotDesc: '새하얀 모래와 옥빛 바다', spotLocation: '제주시 한림읍 협재리', spotImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600', spotTag: '🏖 해변', spotSize: 'small' },
  { spotNo: 3, spotTitle: '성산일출봉', spotDesc: '장엄한 일출 명소', spotLocation: '서귀포시 성산읍', spotImage: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600', spotTag: '🌅 일출', spotSize: 'small' },
  { spotNo: 4, spotTitle: '우도', spotDesc: '섬 속의 작은 섬', spotLocation: '제주시 우도면', spotImage: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600', spotTag: '🚲 우도', spotSize: 'small' },
  { spotNo: 5, spotTitle: '한라산 백록담', spotDesc: '제주의 지붕, 신비로운 분화구', spotLocation: '제주시 해안동', spotImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', spotTag: '🌴 자연', spotSize: 'small' },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/* ─── SVG 캐릭터들 ─── */

// 연 날리는 아이 (서서 위를 올려다봄)
function KiteChild() {
  return (
    <g>
      {/* 연 줄 */}
      <motion.line x1="30" y1="48" x2="58" y2="8"
        stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 2"
        initial={{ x2: 58, y2: 8 }}
        animate={{ x2: [58, 62, 54, 58], y2: [8, 5, 10, 8] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* 연 */}
      <motion.g animate={{ x: [0, 4, -4, 0], y: [0, -2, 2, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        <polygon points="58,0 68,12 58,24 48,12" fill="#c084fc" />
        <polygon points="58,0 68,12 58,24 48,12" fill="none" stroke="#a855f7" strokeWidth="1" />
        <motion.path d="M58,24 Q61,32 56,36 Q61,40 57,45"
          stroke="#c084fc" strokeWidth="1.5" fill="none"
          initial={{ d: "M58,24 Q61,32 56,36 Q61,40 57,45" }}
          animate={{ d: ["M58,24 Q61,32 56,36 Q61,40 57,45","M58,24 Q63,31 54,37 Q63,41 55,47","M58,24 Q61,32 56,36 Q61,40 57,45"] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>
      {/* 머리 */}
      <circle cx="28" cy="55" r="8" fill="#fcd34d" />
      <circle cx="26" cy="53.5" r="1.3" fill="#1e293b" />
      <circle cx="31" cy="53.5" r="1.3" fill="#1e293b" />
      <circle cx="24" cy="56" r="2" fill="#fca5a5" opacity="0.6" />
      <circle cx="32" cy="56" r="2" fill="#fca5a5" opacity="0.6" />
      <path d="M26,58 Q28,59.5 30,58" stroke="#1e293b" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* 모자 */}
      <ellipse cx="28" cy="48" rx="10" ry="2.5" fill="#fb923c" />
      <rect x="22" y="43" width="12" height="5" rx="2.5" fill="#fb923c" />
      {/* 몸 */}
      <rect x="24" y="63" width="8" height="14" rx="4" fill="#38bdf8" />
      {/* 팔 - 연 잡는 손 위로 */}
      <motion.line x1="28" y1="66" x2="35" y2="52"
        stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round"
        initial={{ x2: 35, y2: 52 }}
        animate={{ x2: [35, 37, 33, 35], y2: [52, 50, 54, 52] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <line x1="28" y1="67" x2="20" y2="73" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
      {/* 다리 */}
      <line x1="26" y1="77" x2="24" y2="90" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="30" y1="77" x2="32" y2="90" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
      {/* 신발 */}
      <ellipse cx="23" cy="92" rx="4.5" ry="2.5" fill="#ef4444" />
      <ellipse cx="33" cy="92" rx="4.5" ry="2.5" fill="#ef4444" />
    </g>
  );
}

// 만세하며 점프하는 아이
function JumpingChild() {
  return (
    <motion.g animate={{ y: [0, -10, 0] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}>
      {/* 머리 */}
      <circle cx="28" cy="40" r="8" fill="#fcd34d" />
      <circle cx="26" cy="38.5" r="1.3" fill="#1e293b" />
      <circle cx="31" cy="38.5" r="1.3" fill="#1e293b" />
      <path d="M25,43 Q28,46 31,43" stroke="#1e293b" strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="23" cy="42" r="2" fill="#fca5a5" opacity="0.6" />
      <circle cx="33" cy="42" r="2" fill="#fca5a5" opacity="0.6" />
      {/* 리본 */}
      <path d="M22,33 L26,29 L28,33" fill="#f472b6" />
      <path d="M28,33 L30,29 L34,33" fill="#f472b6" />
      {/* 원피스 */}
      <path d="M22,48 L20,72 Q28,76 36,72 L34,48 Q28,45 22,48Z" fill="#f472b6" />
      {/* 만세 팔 */}
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
      {/* 다리 */}
      <line x1="25" y1="72" x2="22" y2="85" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="31" y1="72" x2="34" y2="85" stroke="#fcd34d" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="21" cy="87" rx="4.5" ry="2.5" fill="#a855f7" />
      <ellipse cx="35" cy="87" rx="4.5" ry="2.5" fill="#a855f7" />
    </motion.g>
  );
}

// 모래성 만드는 아이 (쪼그려 앉음)
function SandcastleChild() {
  return (
    <g>
      {/* 모래성 */}
      <rect x="40" y="72" width="18" height="20" rx="2" fill="#fbbf24" opacity="0.7" />
      <rect x="44" y="65" width="10" height="8" rx="1.5" fill="#f59e0b" opacity="0.7" />
      <rect x="47" y="59" width="4" height="6" rx="1" fill="#fbbf24" opacity="0.7" />
      {/* 깃발 */}
      <line x1="49" y1="50" x2="49" y2="59" stroke="#78716c" strokeWidth="1" />
      <motion.polygon points="49,50 58,53 49,56" fill="#ef4444"
        initial={{ points: "49,50 58,53 49,56" }}
        animate={{ points: ["49,50 58,53 49,56","49,50 57,54 49,56","49,50 58,53 49,56"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* 머리 */}
      <circle cx="22" cy="60" r="7.5" fill="#fcd34d" />
      <circle cx="20" cy="58.5" r="1.2" fill="#1e293b" />
      <circle cx="25" cy="58.5" r="1.2" fill="#1e293b" />
      <path d="M20,62 Q22,64 24,62" stroke="#1e293b" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <circle cx="18" cy="61.5" r="1.8" fill="#fca5a5" opacity="0.5" />
      <circle cx="27" cy="61.5" r="1.8" fill="#fca5a5" opacity="0.5" />
      {/* 모자 (뒤집어) */}
      <path d="M14,56 Q22,52 30,56" fill="#22d3ee" stroke="#06b6d4" strokeWidth="0.8" />
      {/* 몸 (쪼그린 자세) */}
      <rect x="18" y="68" width="8" height="10" rx="4" fill="#4ade80" />
      {/* 팔 - 모래성 쪽으로 */}
      <motion.line x1="24" y1="72" x2="38" y2="78"
        stroke="#fcd34d" strokeWidth="3" strokeLinecap="round"
        initial={{ x2: 38, y2: 78 }}
        animate={{ x2: [38, 36, 38], y2: [78, 76, 78] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      />
      <line x1="20" y1="72" x2="14" y2="78" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
      {/* 다리 (앉은 자세) */}
      <path d="M20,78 Q18,85 22,90" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M24,78 Q28,84 32,88" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <ellipse cx="22" cy="91" rx="4" ry="2.5" fill="#3b82f6" />
      <ellipse cx="33" cy="89" rx="4" ry="2.5" fill="#3b82f6" />
    </g>
  );
}

// 강아지 (꼬리 흔듬)
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

// 갈매기
function Seagull({ className, delay = 0 }) {
  return (
    <motion.svg className={className} viewBox="0 0 40 20" fill="none"
      animate={{ x: [0, 15, 0], y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <motion.path d="M0,12 Q10,2 20,10 Q30,2 40,12"
        stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" fill="none"
        initial={{ d: "M0,12 Q10,2 20,10 Q30,2 40,12" }}
        animate={{ d: ["M0,12 Q10,2 20,10 Q30,2 40,12","M0,8 Q10,14 20,10 Q30,14 40,8","M0,12 Q10,2 20,10 Q30,2 40,12"] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    </motion.svg>
  );
}

// 비치볼
function BeachBall() {
  return (
    <motion.g animate={{ y: [0, -14, 0], rotate: [0, 150, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '15px 15px' }}
    >
      <circle cx="15" cy="15" r="12" fill="#fbbf24" />
      <path d="M15,3 Q21,15 15,27" stroke="white" strokeWidth="2" fill="none" />
      <path d="M15,3 Q9,15 15,27" stroke="#ef4444" strokeWidth="4.5" fill="none" opacity="0.5" />
      <path d="M3,15 Q15,9 27,15" stroke="#3b82f6" strokeWidth="4.5" fill="none" opacity="0.5" />
    </motion.g>
  );
}

// 야자수
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
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* 이미지 */}
          <div className="relative h-72 sm:h-80">
            <img
              src={spot.spotImage}
              alt={spot.spotTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* 태그 */}
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm font-bold text-slate-700 shadow-lg border border-white/60">
                {spot.spotTag}
              </span>
            </div>
            {/* 제목 오버레이 */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3
                className="text-3xl md:text-4xl font-black text-white drop-shadow-lg"
                style={{ fontFamily: "'GmarketSans', sans-serif" }}
              >
                {spot.spotTitle}
              </h3>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* 설명 */}
            <p
              className="text-slate-600 text-base leading-relaxed"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              {spot.spotDesc || '제주도의 아름다운 명소입니다.'}
            </p>

            {/* 정보 카드들 */}
            <div className="grid grid-cols-2 gap-3">
              {spot.spotLocation && (
                <div className="flex items-center gap-3 p-4 bg-sky-50/80 rounded-2xl">
                  <div className="w-10 h-10 flex items-center justify-center bg-sky-100 rounded-xl">
                    <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">위치</p>
                    <p className="text-sm text-slate-700 font-bold" style={{ fontFamily: "'Pretendard', sans-serif" }}>{spot.spotLocation}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-4 bg-amber-50/80 rounded-2xl">
                <div className="w-10 h-10 flex items-center justify-center bg-amber-100 rounded-xl">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">카테고리</p>
                  <p className="text-sm text-slate-700 font-bold" style={{ fontFamily: "'Pretendard', sans-serif" }}>{spot.spotTag}</p>
                </div>
              </div>
            </div>

            {/* 추천 문구 */}
            <div className="p-4 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl border border-sky-100/50">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">💡</span>
                <div>
                  <p className="text-sm font-bold text-sky-700 mb-1" style={{ fontFamily: "'Pretendard', sans-serif" }}>혼디 추천</p>
                  <p className="text-sm text-slate-500 leading-relaxed" style={{ fontFamily: "'Pretendard', sans-serif" }}>
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

export default function SpotsSection() {
  const { data } = useActiveSpots();
  const [selectedSpot, setSelectedSpot] = useState(null);

  const allSpots = (data?.success && data.data?.length > 0)
    ? data.data
    : DEFAULT_SPOTS;
  // 최대 5개만 표시
  const spots = allSpots.slice(0, 5);

  return (
    <section className="relative pt-16 pb-72 overflow-hidden">
      {/* 하늘 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50/40" />

      {/* 구름들 */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* 큰 구름 1 - 왼쪽 위 (느리게) */}
        <motion.svg
          className="absolute top-6 left-[5%] w-36 md:w-48 opacity-80"
          viewBox="0 0 200 80" fill="white"
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ellipse cx="70" cy="50" rx="55" ry="25" />
          <ellipse cx="110" cy="42" rx="40" ry="22" />
          <ellipse cx="45" cy="44" rx="30" ry="18" />
          <ellipse cx="90" cy="36" rx="35" ry="20" />
          <ellipse cx="65" cy="38" rx="28" ry="18" />
        </motion.svg>

        {/* 작은 구름 2 - 오른쪽 위 */}
        <motion.svg
          className="absolute top-14 right-[10%] w-28 md:w-36 opacity-70"
          viewBox="0 0 160 60" fill="white"
          animate={{ x: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ellipse cx="55" cy="38" rx="40" ry="18" />
          <ellipse cx="90" cy="32" rx="32" ry="16" />
          <ellipse cx="70" cy="28" rx="28" ry="16" />
        </motion.svg>

        {/* 중간 구름 3 - 중앙 */}
        <motion.svg
          className="absolute top-3 left-[38%] w-24 md:w-32 opacity-60"
          viewBox="0 0 140 50" fill="white"
          animate={{ x: [0, 25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        >
          <ellipse cx="50" cy="30" rx="35" ry="15" />
          <ellipse cx="80" cy="26" rx="28" ry="14" />
          <ellipse cx="60" cy="22" rx="22" ry="12" />
        </motion.svg>

        {/* 작은 구름 4 - 왼쪽 중간 */}
        <motion.svg
          className="absolute top-28 left-[18%] w-20 md:w-24 opacity-50"
          viewBox="0 0 120 45" fill="white"
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        >
          <ellipse cx="40" cy="28" rx="30" ry="13" />
          <ellipse cx="65" cy="24" rx="24" ry="12" />
          <ellipse cx="50" cy="20" rx="20" ry="11" />
        </motion.svg>

        {/* 작은 구름 5 - 오른쪽 중간 */}
        <motion.svg
          className="absolute top-24 right-[22%] w-16 md:w-20 opacity-45"
          viewBox="0 0 100 40" fill="white"
          animate={{ x: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
        >
          <ellipse cx="35" cy="25" rx="25" ry="12" />
          <ellipse cx="55" cy="20" rx="22" ry="11" />
          <ellipse cx="45" cy="18" rx="18" ry="10" />
        </motion.svg>
      </div>

      {/* 갈매기 */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <Seagull className="absolute top-16 left-[12%] w-8" delay={0} />
        <Seagull className="absolute top-10 left-[52%] w-6" delay={1.2} />
        <Seagull className="absolute top-20 right-[18%] w-7" delay={2.5} />
      </div>

      {/* 카드 영역 */}
      <div className="max-w-6xl mx-auto px-5 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-sky-600 mb-5 shadow-md shadow-sky-200/40 border border-white/80"
          >
            <span>✨</span> <span style={{ fontFamily: "'GmarketSans', sans-serif", letterSpacing: '0.05em' }}>HOT PLACE</span>
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
            혼행러들이 사랑한 <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">명소</span>
          </h2>
          <p className="text-slate-400 mt-4 text-lg" style={{ fontFamily: "'Pretendard', sans-serif" }}>푸른 바다와 함께하는 특별한 순간들</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {spots.map((spot, idx) => {
            const isLarge = spot.spotSize === 'large' || (spot.spotSize == null && idx === 0);
            return (
              <motion.div key={spot.spotNo} variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg shadow-sky-100/50 hover:shadow-2xl hover:shadow-sky-200/60 transition-shadow duration-500 ${isLarge ? 'col-span-2 row-span-2' : ''}`}
              >
                <div className={`relative ${isLarge ? 'h-full min-h-[360px]' : 'aspect-[3/4]'}`}>
                  <img src={spot.spotImage} alt={spot.spotTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent group-hover:from-slate-900/90 transition-all duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-slate-700 shadow-lg border border-white/60">{spot.spotTag}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className={`font-black text-white drop-shadow-lg mb-1.5 ${isLarge ? 'text-3xl md:text-4xl' : 'text-xl'}`} style={{ fontFamily: "'GmarketSans', sans-serif" }}>{spot.spotTitle}</h3>
                    <p className={`text-white/80 drop-shadow font-medium ${isLarge ? 'text-base' : 'text-sm'}`} style={{ fontFamily: "'Pretendard', sans-serif" }}>{spot.spotDesc}</p>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <button
                        onClick={() => setSelectedSpot(spot)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/30 transition-colors"
                      >
                        자세히 보기
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ─── 파도 애니메이션 (모래밭 위) ─── */}
      <div className="absolute bottom-40 left-0 right-0 h-24 pointer-events-none overflow-hidden z-[1]" aria-hidden="true">
        {/* 파도 1 - 제일 뒤 (연한 파랑, 느림) */}
        <motion.svg
          className="absolute bottom-0 w-[110%] -left-[5%] h-full"
          viewBox="0 0 1440 80" preserveAspectRatio="none"
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.path
            fill="#bae6fd" opacity="0.4"
            d="M0,50 Q120,30 240,45 Q360,60 480,42 Q600,25 720,48 Q840,65 960,40 Q1080,20 1200,50 Q1320,65 1440,45 L1440,80 L0,80 Z"
            initial={{ d: "M0,50 Q120,30 240,45 Q360,60 480,42 Q600,25 720,48 Q840,65 960,40 Q1080,20 1200,50 Q1320,65 1440,45 L1440,80 L0,80 Z" }}
            animate={{ d: [
              "M0,50 Q120,30 240,45 Q360,60 480,42 Q600,25 720,48 Q840,65 960,40 Q1080,20 1200,50 Q1320,65 1440,45 L1440,80 L0,80 Z",
              "M0,40 Q120,55 240,38 Q360,22 480,48 Q600,60 720,35 Q840,20 960,50 Q1080,62 1200,38 Q1320,25 1440,50 L1440,80 L0,80 Z",
              "M0,50 Q120,30 240,45 Q360,60 480,42 Q600,25 720,48 Q840,65 960,40 Q1080,20 1200,50 Q1320,65 1440,45 L1440,80 L0,80 Z",
            ] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.svg>

        {/* 파도 2 - 중간 (하늘색, 중간속도) */}
        <motion.svg
          className="absolute bottom-0 w-[110%] -left-[5%] h-full"
          viewBox="0 0 1440 80" preserveAspectRatio="none"
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <motion.path
            fill="#7dd3fc" opacity="0.3"
            d="M0,55 Q180,35 360,52 Q540,68 720,45 Q900,28 1080,55 Q1260,68 1440,48 L1440,80 L0,80 Z"
            initial={{ d: "M0,55 Q180,35 360,52 Q540,68 720,45 Q900,28 1080,55 Q1260,68 1440,48 L1440,80 L0,80 Z" }}
            animate={{ d: [
              "M0,55 Q180,35 360,52 Q540,68 720,45 Q900,28 1080,55 Q1260,68 1440,48 L1440,80 L0,80 Z",
              "M0,42 Q180,60 360,40 Q540,25 720,52 Q900,65 1080,38 Q1260,25 1440,55 L1440,80 L0,80 Z",
              "M0,55 Q180,35 360,52 Q540,68 720,45 Q900,28 1080,55 Q1260,68 1440,48 L1440,80 L0,80 Z",
            ] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </motion.svg>

        {/* 파도 3 - 제일 앞 (물거품, 밀려왔다 빠짐) */}
        <motion.svg
          className="absolute bottom-0 w-[115%] -left-[7%] h-full"
          viewBox="0 0 1440 80" preserveAspectRatio="none"
          animate={{ x: [0, 25, 0], y: [0, -4, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <motion.path
            fill="#e0f2fe" opacity="0.5"
            d="M0,62 Q100,48 200,58 Q300,68 400,55 Q500,42 600,60 Q700,70 800,52 Q900,40 1000,58 Q1100,68 1200,54 Q1300,42 1440,60 L1440,80 L0,80 Z"
            initial={{ d: "M0,62 Q100,48 200,58 Q300,68 400,55 Q500,42 600,60 Q700,70 800,52 Q900,40 1000,58 Q1100,68 1200,54 Q1300,42 1440,60 L1440,80 L0,80 Z" }}
            animate={{ d: [
              "M0,62 Q100,48 200,58 Q300,68 400,55 Q500,42 600,60 Q700,70 800,52 Q900,40 1000,58 Q1100,68 1200,54 Q1300,42 1440,60 L1440,80 L0,80 Z",
              "M0,52 Q100,65 200,50 Q300,38 400,58 Q500,68 600,48 Q700,36 800,56 Q900,68 1000,50 Q1100,38 1200,60 Q1300,68 1440,50 L1440,80 L0,80 Z",
              "M0,62 Q100,48 200,58 Q300,68 400,55 Q500,42 600,60 Q700,70 800,52 Q900,40 1000,58 Q1100,68 1200,54 Q1300,42 1440,60 L1440,80 L0,80 Z",
            ] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          {/* 거품 라인 */}
          <motion.path
            fill="none" stroke="white" strokeWidth="2" opacity="0.6"
            d="M0,60 Q100,46 200,56 Q300,66 400,53 Q500,40 600,58 Q700,68 800,50 Q900,38 1000,56 Q1100,66 1200,52 Q1300,40 1440,58"
            initial={{ d: "M0,60 Q100,46 200,56 Q300,66 400,53 Q500,40 600,58 Q700,68 800,50 Q900,38 1000,56 Q1100,66 1200,52 Q1300,40 1440,58" }}
            animate={{ d: [
              "M0,60 Q100,46 200,56 Q300,66 400,53 Q500,40 600,58 Q700,68 800,50 Q900,38 1000,56 Q1100,66 1200,52 Q1300,40 1440,58",
              "M0,50 Q100,63 200,48 Q300,36 400,56 Q500,66 600,46 Q700,34 800,54 Q900,66 1000,48 Q1100,36 1200,58 Q1300,66 1440,48",
              "M0,60 Q100,46 200,56 Q300,66 400,53 Q500,40 600,58 Q700,68 800,50 Q900,38 1000,56 Q1100,66 1200,52 Q1300,40 1440,58",
            ] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </motion.svg>

        {/* 물거품 점들 (파도 끝에 생기는 방울) */}
        {[8, 18, 32, 45, 58, 72, 85, 94].map((left, i) => (
          <motion.div
            key={i}
            className="absolute bottom-1"
            style={{ left: `${left}%` }}
            animate={{
              opacity: [0, 0.7, 0],
              scale: [0.3, 1, 0.3],
              y: [0, -3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.35,
            }}
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        ))}
      </div>

      {/* ─── 하단 모래밭 해변 씬 ─── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        aria-hidden="true"
      >
        {/* 젖은 모래 (파도가 닿는 부분) */}
        <svg className="absolute top-0 w-full h-8" viewBox="0 0 1440 30" preserveAspectRatio="none">
          <motion.path
            fill="#d4a76a" opacity="0.15"
            d="M0,0 Q180,12 360,5 Q540,15 720,3 Q900,14 1080,6 Q1260,16 1440,4 L1440,30 L0,30 Z"
            initial={{ d: "M0,0 Q180,12 360,5 Q540,15 720,3 Q900,14 1080,6 Q1260,16 1440,4 L1440,30 L0,30 Z" }}
            animate={{ d: [
              "M0,0 Q180,12 360,5 Q540,15 720,3 Q900,14 1080,6 Q1260,16 1440,4 L1440,30 L0,30 Z",
              "M0,8 Q180,0 360,10 Q540,2 720,14 Q900,4 1080,12 Q1260,2 1440,10 L1440,30 L0,30 Z",
              "M0,0 Q180,12 360,5 Q540,15 720,3 Q900,14 1080,6 Q1260,16 1440,4 L1440,30 L0,30 Z",
            ] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>

        {/* 모래 배경 */}
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 160" preserveAspectRatio="none">
          <path d="M0,30 Q180,10 360,25 Q540,42 720,22 Q900,6 1080,30 Q1260,48 1440,24 L1440,160 L0,160 Z" fill="#fef9c3" opacity="0.7" />
          <path d="M0,55 Q200,40 400,52 Q600,65 800,48 Q1000,35 1200,52 Q1350,62 1440,45 L1440,160 L0,160 Z" fill="#fef08a" opacity="0.4" />
          <path d="M0,80 Q300,68 600,78 Q900,90 1200,76 Q1380,68 1440,72 L1440,160 L0,160 Z" fill="#fde68a" opacity="0.3" />
        </svg>

        {/* === 모래밭 위 캐릭터들 (하나의 큰 SVG) === */}
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 140" preserveAspectRatio="xMidYMax meet">

          {/* 야자수 (왼쪽 끝) */}
          <g transform="translate(40, 0)" opacity="0.65">
            <PalmTree />
          </g>

          {/* 연 날리는 아이 */}
          <g transform="translate(160, 38)" opacity="0.75">
            <KiteChild />
          </g>

          {/* 강아지 */}
          <g transform="translate(310, 88)" opacity="0.7">
            <Dog />
          </g>

          {/* 비치볼 */}
          <g transform="translate(440, 90)" opacity="0.7">
            <BeachBall />
          </g>

          {/* 모래성 만드는 아이 */}
          <g transform="translate(520, 40)" opacity="0.75">
            <SandcastleChild />
          </g>

          {/* 발자국들 */}
          {[380, 400, 420, 680, 700, 720].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${118 + (i % 2) * 4}) rotate(${i % 2 === 0 ? -8 : 8})`} opacity="0.2">
              <ellipse cx="5" cy="9" rx="3" ry="4.5" fill="#92400e" />
              <circle cx="3" cy="2.5" r="1.2" fill="#92400e" />
              <circle cx="5" cy="1.5" r="1.2" fill="#92400e" />
              <circle cx="7" cy="2.5" r="1.2" fill="#92400e" />
            </g>
          ))}

          {/* 점프하는 아이 */}
          <g transform="translate(780, 38)" opacity="0.75">
            <JumpingChild />
          </g>

          {/* 조개 */}
          <g transform="translate(910, 115)" opacity="0.55">
            <path d="M8,0 Q14,5 14,12 Q8,10 2,12 Q2,5 8,0Z" fill="#fda4af" stroke="#fb7185" strokeWidth="0.6" />
            <line x1="8" y1="0" x2="8" y2="12" stroke="#fb7185" strokeWidth="0.4" opacity="0.4" />
          </g>

          {/* 불가사리 */}
          <g transform="translate(960, 112)" opacity="0.5">
            <path d="M8,0 L9.5,6 L16,6 L11,9.5 L12.5,16 L8,12 L3.5,16 L5,9.5 L0,6 L6.5,6 Z" fill="#fb923c" />
          </g>

          {/* 야자수 (오른쪽 끝) */}
          <g transform="translate(1080, 5)" opacity="0.55">
            <PalmTree />
          </g>
        </svg>
      </motion.div>

      {/* 상세 모달 */}
      {selectedSpot && (
        <SpotDetailModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
      )}
    </section>
  );
}
