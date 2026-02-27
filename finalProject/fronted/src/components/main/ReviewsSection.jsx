import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRecentReviews } from '../../api/review/useReview';
import { Loader2 } from 'lucide-react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const navigate = useNavigate();
  const [reviewSlide, setReviewSlide] = useState(0);

  const { data, isLoading } = useRecentReviews(9);
  const reviews = data?.success ? (data.list || []) : [];

  const maxSlide = Math.max(0, reviews.length - 3);
  const nextReview = () => setReviewSlide(prev => Math.min(prev + 1, maxSlide));
  const prevReview = () => setReviewSlide(prev => Math.max(prev - 1, 0));

  return (
    <section className="relative py-24 bg-gradient-to-b from-sky-50 via-white to-sky-50/50 overflow-hidden">
      {/* 상단 페이드 - AccommodationsSection에서 자연스럽게 녹아듦 */}
      <div className="absolute top-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-b from-[#bbf7d0]/30 via-[#e0f2fe]/40 to-transparent z-[1]" />

      {/* 배경 장식 */}
      <motion.div
        className="absolute top-16 right-[8%] w-48 h-48 bg-rose-100/40 rounded-full blur-3xl"
        animate={{ y: [0, -15, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-16 left-[8%] w-40 h-40 bg-amber-100/40 rounded-full blur-3xl"
        animate={{ y: [0, 15, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-6xl mx-auto px-5 relative">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-sm font-bold text-rose-500 shadow-md shadow-rose-100/40 mb-5 border border-rose-100/60"
            >
              <span>💬</span> REAL REVIEW
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
              혼행러들의 <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">솔직한 후기</span>
            </h2>
            <p className="text-slate-400 mt-4 text-lg" style={{ fontFamily: "'Pretendard', sans-serif" }}>직접 다녀온 분들의 생생한 이야기</p>
          </div>
          {reviews.length > 3 && (
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevReview}
                disabled={reviewSlide === 0}
                className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100/60 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-slate-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextReview}
                disabled={reviewSlide >= maxSlide}
                className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100/60 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-slate-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* 카드 슬라이드 */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <Loader2 className="w-10 h-10 text-rose-400" />
            </motion.div>
          </div>
        )}

        {!isLoading && reviews.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-100"
            >
              <span className="text-3xl">💬</span>
            </motion.div>
            <p className="text-slate-400 text-lg font-medium">아직 작성된 후기가 없습니다</p>
          </motion.div>
        )}

        {!isLoading && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <div className="flex gap-6 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${reviewSlide * 360}px)` }}>
              {reviews.map((review, index) => (
                <motion.div
                  key={review.reviewNo}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  onClick={() => navigate(`/reviews/${review.reviewNo}`)}
                  className="flex-shrink-0 w-[340px] bg-white rounded-3xl overflow-hidden shadow-lg shadow-sky-100/40 hover:shadow-2xl hover:shadow-rose-100/40 transition-shadow duration-500 border border-sky-50/60 cursor-pointer group"
                >
                  {/* 썸네일 */}
                  {review.imageUrl && (
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={review.imageUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                      {/* 별점 배지 */}
                      <span className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-amber-500 shadow-lg flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {review.rating}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* 작성자 */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-rose-200/50 overflow-hidden">
                        {review.authorProfile ? (
                          <img src={review.authorProfile} alt="" loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                          review.authorNickname?.[0] || '?'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm">{review.authorNickname || '익명'}</p>
                        <p className="text-xs text-slate-400">{review.createdAt}</p>
                      </div>
                      {review.companionTitle && (
                        <span className="px-2.5 py-1 bg-sky-50 text-sky-600 rounded-full text-[11px] font-semibold line-clamp-1 max-w-[100px] flex-shrink-0">
                          {review.companionTitle}
                        </span>
                      )}
                    </div>

                    {/* 제목 + 내용 */}
                    <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors duration-300">{review.title}</h3>
                    <p className="text-slate-500 leading-relaxed line-clamp-2 text-sm mb-4">"{review.content}"</p>

                    {/* 별점 */}
                    <StarRating rating={review.rating} />
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
            onClick={() => navigate('/reviews')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-rose-500 font-bold rounded-full shadow-lg shadow-rose-100/40 hover:shadow-xl border border-rose-100/60 transition-all"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            후기 더보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
