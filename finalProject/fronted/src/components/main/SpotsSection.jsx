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

export default function SpotsSection() {
  return (
    <section className="relative bg-white pt-16 pb-24 overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-10 right-0 w-80 h-80 bg-gradient-to-br from-sky-100/60 to-cyan-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 left-0 w-60 h-60 bg-gradient-to-tr from-cyan-100/50 to-sky-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-5">
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
