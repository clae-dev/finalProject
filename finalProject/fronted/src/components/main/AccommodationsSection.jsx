import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAccommodations } from '../../api/useAccommodation';
import { Loader2, MapPin, Heart } from 'lucide-react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500';

function formatPrice(priceMin, priceMax) {
  if (!priceMin && !priceMax) return '가격 문의';
  if (priceMin && priceMax) return `${(priceMin / 10000).toFixed(0)}~${(priceMax / 10000).toFixed(0)}만원`;
  if (priceMin) return `${(priceMin / 10000).toFixed(0)}만원~`;
  return `~${(priceMax / 10000).toFixed(0)}만원`;
}

export default function AccommodationsSection() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);

  const { data, isLoading } = useAccommodations(1, 9);
  const accommodations = data?.success ? (data.list || []) : [];

  const maxSlide = Math.max(0, accommodations.length - 3);
  const nextSlide = () => setSlide(prev => Math.min(prev + 1, maxSlide));
  const prevSlide = () => setSlide(prev => Math.max(prev - 1, 0));

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-sky-50/60 to-cyan-50/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-5">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full text-sm font-bold text-amber-600 mb-5 shadow-sm border border-amber-100/60"
            >
              <span>🏠</span> .STAY
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
              혼행에 딱 맞는 <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">숙소</span>
            </h2>
            <p className="text-slate-400 mt-4 text-lg" style={{ fontFamily: "'Pretendard', sans-serif" }}>파도 소리 들으며 편안한 하룻밤</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              disabled={slide === 0}
              className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100/60 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-slate-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              disabled={slide >= maxSlide}
              className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100/60 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-slate-100"
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
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <div className="flex gap-7 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${slide * 340}px)` }}>
              {accommodations.map((acc, index) => (
                <motion.div
                  key={acc.accommodationNo}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  onClick={() => navigate(`/accommodations/${acc.accommodationNo}`)}
                  className="flex-shrink-0 w-80 group cursor-pointer"
                >
                  {/* 이미지 */}
                  <div className="relative rounded-3xl overflow-hidden mb-5 shadow-lg shadow-slate-100/60 group-hover:shadow-2xl group-hover:shadow-sky-100/40 transition-shadow duration-500">
                    <div className="aspect-[4/3]">
                      <img
                        src={acc.thumbnailUrl || DEFAULT_IMAGE}
                        alt={acc.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* 하트 */}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-4 right-4 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform"
                    >
                      <Heart className="w-5 h-5 text-slate-300 hover:text-rose-500 transition-colors" />
                    </button>

                    {/* 타입 배지 */}
                    {acc.accommodationType && (
                      <div className="absolute bottom-4 left-4">
                        <span className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm font-bold text-amber-600 shadow-lg border border-white/60">
                          {acc.accommodationType}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 텍스트 */}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/accommodations')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-amber-600 font-bold rounded-full shadow-lg shadow-amber-100/50 hover:shadow-xl border border-amber-100/60 transition-all"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            숙소 더보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
