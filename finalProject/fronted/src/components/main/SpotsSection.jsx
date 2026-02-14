import React from 'react';
import { motion } from 'framer-motion';

const spots = [
  { id: 1, title: '월정리 해변', desc: '에메랄드빛 투명한 바다', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', tag: '🔥 인기' },
  { id: 2, title: '협재해수욕장', desc: '새하얀 모래와 옥빛 바다', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600', tag: '🏖 해변' },
  { id: 3, title: '성산일출봉', desc: '장엄한 일출 명소', image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600', tag: '🌅 일출' },
  { id: 4, title: '우도', desc: '섬 속의 작은 섬', image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600', tag: '🚲 우도' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/* ─── 2D 캐릭터 SVG 컴포넌트들 ─── */

// 연 날리는 아이
function KiteChild({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 160" fill="none">
      {/* 연 줄 */}
      <motion.line
        x1="42" y1="75" x2="75" y2="15"
        stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="3 2"
        animate={{ x2: [75, 80, 70, 75], y2: [15, 12, 18, 15] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* 연 */}
      <motion.g
        animate={{ x: [0, 5, -5, 0], y: [0, -3, 3, 0], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <polygon points="75,5 90,20 75,35 60,20" fill="#f0abfc" opacity="0.7" />
        <polygon points="75,5 90,20 75,35 60,20" fill="none" stroke="#e879f9" strokeWidth="1" opacity="0.5" />
        <line x1="75" y1="20" x2="90" y2="20" stroke="#e879f9" strokeWidth="0.8" opacity="0.4" />
        <line x1="75" y1="5" x2="75" y2="35" stroke="#e879f9" strokeWidth="0.8" opacity="0.4" />
        {/* 연 꼬리 */}
        <motion.path
          d="M75,35 Q78,45 72,50 Q78,55 74,62"
          stroke="#f0abfc" strokeWidth="1.5" fill="none" opacity="0.6"
          animate={{ d: [
            "M75,35 Q78,45 72,50 Q78,55 74,62",
            "M75,35 Q80,44 70,52 Q80,56 72,64",
            "M75,35 Q78,45 72,50 Q78,55 74,62",
          ]}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>
      {/* 몸 */}
      <circle cx="40" cy="82" r="9" fill="#fbbf24" /> {/* 머리 */}
      <circle cx="37" cy="80" r="1.2" fill="#1e293b" /> {/* 눈 */}
      <circle cx="43" cy="80" r="1.2" fill="#1e293b" />
      <path d="M38,84 Q40,86.5 42,84" stroke="#1e293b" strokeWidth="1" fill="none" strokeLinecap="round" /> {/* 미소 */}
      <rect x="35" y="91" width="10" height="18" rx="5" fill="#38bdf8" /> {/* 몸통 */}
      {/* 팔 - 연 잡는 손 */}
      <motion.line
        x1="40" y1="95" x2="48" y2="80"
        stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"
        animate={{ x2: [48, 50, 46, 48], y2: [80, 78, 82, 80] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <line x1="40" y1="96" x2="32" y2="102" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
      {/* 다리 */}
      <line x1="38" y1="109" x2="35" y2="125" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <line x1="42" y1="109" x2="45" y2="125" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      {/* 신발 */}
      <ellipse cx="34" cy="127" rx="5" ry="3" fill="#ef4444" />
      <ellipse cx="46" cy="127" rx="5" ry="3" fill="#ef4444" />
      {/* 모자 */}
      <ellipse cx="40" cy="74" rx="12" ry="3" fill="#fb923c" />
      <rect x="33" y="68" width="14" height="6" rx="3" fill="#fb923c" />
    </svg>
  );
}

// 달리는 아이
function RunningChild({ className }) {
  return (
    <motion.svg className={className} viewBox="0 0 100 140" fill="none"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* 머리 */}
      <circle cx="50" cy="30" r="10" fill="#fbbf24" />
      <circle cx="47" cy="28" r="1.3" fill="#1e293b" />
      <circle cx="53" cy="28" r="1.3" fill="#1e293b" />
      <path d="M48,33 Q50,35 52,33" stroke="#1e293b" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* 앞머리 */}
      <path d="M42,25 Q45,20 50,22 Q55,19 58,25" fill="#92400e" opacity="0.6" />
      {/* 몸통 */}
      <rect x="44" y="40" width="12" height="20" rx="6" fill="#4ade80" />
      {/* 팔 (달리는 자세) */}
      <motion.line
        x1="48" y1="45" x2="35" y2="38"
        stroke="#fbbf24" strokeWidth="4.5" strokeLinecap="round"
        animate={{ x2: [35, 38, 35], y2: [38, 42, 38] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.line
        x1="52" y1="45" x2="65" y2="50"
        stroke="#fbbf24" strokeWidth="4.5" strokeLinecap="round"
        animate={{ x2: [65, 62, 65], y2: [50, 46, 50] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* 다리 (달리는 자세) */}
      <motion.line
        x1="47" y1="60" x2="38" y2="82"
        stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round"
        animate={{ x2: [38, 55, 38], y2: [82, 78, 82] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.line
        x1="53" y1="60" x2="62" y2="78"
        stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round"
        animate={{ x2: [62, 45, 62], y2: [78, 82, 78] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* 신발 */}
      <motion.ellipse
        cx="37" cy="84" rx="6" ry="3" fill="#3b82f6"
        animate={{ cx: [37, 54, 37], cy: [84, 80, 84] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.ellipse
        cx="63" cy="80" rx="6" ry="3" fill="#3b82f6"
        animate={{ cx: [63, 44, 63], cy: [80, 84, 80] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

// 점프하는 아이
function JumpingChild({ className }) {
  return (
    <motion.svg className={className} viewBox="0 0 100 140" fill="none"
      animate={{ y: [0, -18, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* 머리 */}
      <circle cx="50" cy="32" r="10" fill="#fbbf24" />
      <circle cx="47" cy="30" r="1.3" fill="#1e293b" />
      <circle cx="53" cy="30" r="1.3" fill="#1e293b" />
      {/* 환한 표정 (입 크게) */}
      <path d="M46,35 Q50,39 54,35" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* 볼 홍조 */}
      <circle cx="43" cy="34" r="2.5" fill="#fca5a5" opacity="0.5" />
      <circle cx="57" cy="34" r="2.5" fill="#fca5a5" opacity="0.5" />
      {/* 리본 / 머리띠 */}
      <path d="M42,24 L46,20 L50,24" fill="#f472b6" />
      <path d="M50,24 L54,20 L58,24" fill="#f472b6" />
      {/* 몸통 (원피스) */}
      <path d="M43,42 L40,68 Q50,72 60,68 L57,42 Q50,38 43,42Z" fill="#f472b6" />
      {/* 팔 (만세) */}
      <motion.line
        x1="44" y1="46" x2="28" y2="28"
        stroke="#fbbf24" strokeWidth="4.5" strokeLinecap="round"
        animate={{ x2: [28, 25, 28], y2: [28, 32, 28] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.line
        x1="56" y1="46" x2="72" y2="28"
        stroke="#fbbf24" strokeWidth="4.5" strokeLinecap="round"
        animate={{ x2: [72, 75, 72], y2: [28, 32, 28] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* 손 (별 모양 반짝) */}
      <motion.text x="22" y="26" fontSize="8" animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}>✨</motion.text>
      <motion.text x="68" y="26" fontSize="8" animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}>✨</motion.text>
      {/* 다리 */}
      <line x1="45" y1="68" x2="40" y2="88" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
      <line x1="55" y1="68" x2="60" y2="88" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
      {/* 신발 */}
      <ellipse cx="39" cy="90" rx="5.5" ry="3" fill="#a855f7" />
      <ellipse cx="61" cy="90" rx="5.5" ry="3" fill="#a855f7" />
    </motion.svg>
  );
}

// 강아지
function RunningDog({ className }) {
  return (
    <motion.svg className={className} viewBox="0 0 90 60" fill="none"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* 몸통 */}
      <ellipse cx="45" cy="30" rx="22" ry="12" fill="#d4a574" />
      {/* 머리 */}
      <circle cx="72" cy="22" r="10" fill="#d4a574" />
      {/* 귀 */}
      <motion.ellipse cx="66" cy="13" rx="5" ry="8" fill="#a0845c" transform="rotate(-20 66 13)"
        animate={{ rotate: [-20, -15, -20] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.ellipse cx="78" cy="14" rx="5" ry="7" fill="#a0845c" transform="rotate(15 78 14)"
        animate={{ rotate: [15, 20, 15] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* 눈 */}
      <circle cx="70" cy="20" r="1.5" fill="#1e293b" />
      <circle cx="76" cy="20" r="1.5" fill="#1e293b" />
      {/* 코 */}
      <ellipse cx="80" cy="24" rx="2.5" ry="2" fill="#1e293b" />
      {/* 입 (혀) */}
      <motion.path
        d="M78,27 Q80,31 82,27" fill="#f87171" stroke="#f87171" strokeWidth="0.5"
        animate={{ d: ["M78,27 Q80,31 82,27", "M78,27 Q80,33 82,27", "M78,27 Q80,31 82,27"] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* 꼬리 */}
      <motion.path
        d="M23,25 Q15,10 18,5" stroke="#d4a574" strokeWidth="4" strokeLinecap="round" fill="none"
        animate={{ d: ["M23,25 Q15,10 18,5", "M23,25 Q12,12 20,3", "M23,25 Q15,10 18,5"] }}
        transition={{ duration: 0.3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* 다리 */}
      <motion.line x1="35" y1="40" x2="30" y2="52" stroke="#a0845c" strokeWidth="4" strokeLinecap="round"
        animate={{ x2: [30, 38, 30], y2: [52, 50, 52] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.line x1="42" y1="40" x2="46" y2="52" stroke="#a0845c" strokeWidth="4" strokeLinecap="round"
        animate={{ x2: [46, 38, 46], y2: [52, 50, 52] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.line x1="55" y1="40" x2="52" y2="52" stroke="#a0845c" strokeWidth="4" strokeLinecap="round"
        animate={{ x2: [52, 58, 52], y2: [52, 50, 52] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.line x1="62" y1="40" x2="66" y2="52" stroke="#a0845c" strokeWidth="4" strokeLinecap="round"
        animate={{ x2: [66, 60, 66], y2: [52, 50, 52] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

// 갈매기
function Seagull({ className, delay = 0 }) {
  return (
    <motion.svg className={className} viewBox="0 0 40 20" fill="none"
      animate={{ x: [0, 30, 60], y: [0, -8, 0], opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <motion.path
        d="M0,12 Q10,2 20,10 Q30,2 40,12"
        stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none"
        animate={{
          d: [
            "M0,12 Q10,2 20,10 Q30,2 40,12",
            "M0,8 Q10,14 20,10 Q30,14 40,8",
            "M0,12 Q10,2 20,10 Q30,2 40,12",
          ]
        }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay }}
      />
    </motion.svg>
  );
}

// 비치볼
function BeachBall({ className }) {
  return (
    <motion.svg className={className} viewBox="0 0 40 40" fill="none"
      animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <circle cx="20" cy="20" r="15" fill="#fbbf24" />
      <path d="M20,5 Q25,20 20,35" stroke="white" strokeWidth="2" fill="none" />
      <path d="M20,5 Q15,20 20,35" stroke="#ef4444" strokeWidth="6" fill="none" opacity="0.4" />
      <path d="M5,20 Q20,15 35,20" stroke="#3b82f6" strokeWidth="6" fill="none" opacity="0.4" />
      <circle cx="20" cy="20" r="15" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
    </motion.svg>
  );
}

export default function SpotsSection() {
  return (
    <section className="relative bg-white pt-16 pb-24 overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-10 right-0 w-80 h-80 bg-gradient-to-br from-sky-100/60 to-cyan-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 left-0 w-60 h-60 bg-gradient-to-tr from-cyan-100/50 to-sky-100/30 rounded-full blur-3xl -z-10" />

      {/* ─── 2D 캐릭터 배경 일러스트 ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* 갈매기들 */}
        <Seagull className="absolute top-8 left-[12%] w-10 opacity-30" delay={0} />
        <Seagull className="absolute top-16 left-[35%] w-8 opacity-20" delay={1.5} />
        <Seagull className="absolute top-6 right-[20%] w-9 opacity-25" delay={3} />

        {/* 연 날리는 아이 (왼쪽) */}
        <motion.div
          className="absolute bottom-8 left-[3%] opacity-[0.13]"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 0.13, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <KiteChild className="w-28 md:w-36" />
        </motion.div>

        {/* 달리는 아이 (왼쪽→오른쪽 이동) */}
        <motion.div
          className="absolute bottom-12 opacity-[0.12]"
          animate={{ x: ['-5%', '105%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          <RunningChild className="w-16 md:w-20" />
        </motion.div>

        {/* 점프하는 아이 (오른쪽) */}
        <motion.div
          className="absolute bottom-8 right-[5%] opacity-[0.13]"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 0.13, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <JumpingChild className="w-24 md:w-28" />
        </motion.div>

        {/* 달리는 강아지 (오른쪽→왼쪽) */}
        <motion.div
          className="absolute bottom-14 opacity-[0.1]"
          animate={{ x: ['105%', '-5%'] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 5 }}
        >
          <RunningDog className="w-20 md:w-24" />
        </motion.div>

        {/* 비치볼 */}
        <motion.div
          className="absolute bottom-20 left-[22%] opacity-[0.15]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.15 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          <BeachBall className="w-8 md:w-10" />
        </motion.div>

        {/* 모래 바닥 라인 */}
        <div className="absolute bottom-0 left-0 right-0 h-16">
          <svg className="w-full h-full" viewBox="0 0 1440 60" preserveAspectRatio="none" fill="none">
            <motion.path
              d="M0,40 Q200,30 400,38 Q600,46 800,35 Q1000,28 1200,40 Q1350,48 1440,36"
              stroke="#e2e8f0" strokeWidth="1.5" opacity="0.3" fill="none"
              animate={{
                d: [
                  "M0,40 Q200,30 400,38 Q600,46 800,35 Q1000,28 1200,40 Q1350,48 1440,36",
                  "M0,38 Q200,46 400,34 Q600,28 800,42 Q1000,48 1200,35 Q1350,30 1440,40",
                  "M0,40 Q200,30 400,38 Q600,46 800,35 Q1000,28 1200,40 Q1350,48 1440,36",
                ]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
          {/* 발자국들 */}
          {[8, 15, 25, 35, 65, 78, 88].map((left, i) => (
            <motion.div
              key={i}
              className="absolute bottom-3"
              style={{ left: `${left}%` }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.08 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
            >
              <svg width="14" height="18" viewBox="0 0 14 18" fill="#94a3b8">
                <ellipse cx="7" cy="12" rx="4" ry="5.5" />
                <circle cx="4" cy="4" r="1.8" />
                <circle cx="7" cy="2.5" r="1.8" />
                <circle cx="10" cy="4" r="1.8" />
              </svg>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 relative z-10">
        {/* 헤더 */}
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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-full text-sm font-bold text-sky-600 mb-5 shadow-sm border border-sky-100/60"
          >
            <span>🌊</span> HOT PLACE
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
            혼행러들이 사랑한 <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">명소</span>
          </h2>
          <p className="text-slate-400 mt-4 text-lg" style={{ fontFamily: "'Pretendard', sans-serif" }}>푸른 바다와 함께하는 특별한 순간들</p>
        </motion.div>

        {/* 그리드 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {spots.map((spot, idx) => (
            <motion.div
              key={spot.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg shadow-sky-100/50 hover:shadow-2xl hover:shadow-sky-200/60 transition-shadow duration-500 ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}
            >
              <div className={`relative ${idx === 0 ? 'h-full min-h-[360px]' : 'aspect-[3/4]'}`}>
                <img src={spot.image} alt={spot.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms] ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent group-hover:from-slate-900/90 transition-all duration-500" />

                {/* 태그 */}
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-slate-700 shadow-lg border border-white/60">
                    {spot.tag}
                  </span>
                </div>

                {/* 텍스트 - 하단 */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className={`font-black text-white drop-shadow-lg mb-1.5 ${idx === 0 ? 'text-3xl md:text-4xl' : 'text-xl'}`} style={{ fontFamily: "'GmarketSans', sans-serif" }}>
                    {spot.title}
                  </h3>
                  <p className={`text-white/80 drop-shadow font-medium ${idx === 0 ? 'text-base' : 'text-sm'}`} style={{ fontFamily: "'Pretendard', sans-serif" }}>
                    {spot.desc}
                  </p>

                  {/* 호버 시 탐색 버튼 */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold text-white border border-white/30">
                      자세히 보기
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
