import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentReviews } from '../../api/useReview';
import { Loader2 } from 'lucide-react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
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
    <section className="py-20 bg-sky-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-end justify-between mb-12">
          <div className="text-center flex-1">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-semibold text-rose-500 shadow-sm mb-4">
              <span>💬</span> REAL REVIEW
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">혼행러들의 솔직한 후기</h2>
            <p className="text-slate-500 mt-3">직접 다녀온 분들의 생생한 이야기</p>
          </div>
          {reviews.length > 3 && (
            <div className="flex gap-3">
              <button onClick={prevReview} disabled={reviewSlide === 0}
                className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100 flex items-center justify-center text-sky-500 hover:text-sky-600 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={nextReview} disabled={reviewSlide >= maxSlide}
                className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100 flex items-center justify-center text-sky-500 hover:text-sky-600 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          </div>
        )}

        {!isLoading && reviews.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400">아직 작성된 후기가 없습니다</p>
          </div>
        )}

        {!isLoading && reviews.length > 0 && (
          <div className="overflow-hidden">
            <div className="flex gap-6 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${reviewSlide * 360}px)` }}>
              {reviews.map(review => (
                <div
                  key={review.reviewNo}
                  onClick={() => navigate(`/reviews/${review.reviewNo}`)}
                  className="flex-shrink-0 w-[340px] bg-white rounded-3xl p-7 shadow-lg shadow-sky-100 hover:shadow-xl hover:shadow-sky-200 hover:-translate-y-1 transition-all border border-sky-50 cursor-pointer"
                >
                  {review.imageUrl && (
                    <div className="relative h-40 rounded-2xl overflow-hidden mb-5">
                      <img
                        src={review.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-2xl flex items-center justify-center text-white font-bold shadow-md shadow-sky-200/50 overflow-hidden ring-4 ring-sky-50">
                      {review.authorProfile ? (
                        <img src={review.authorProfile} alt="" className="w-full h-full object-cover" />
                      ) : (
                        review.authorNickname?.[0] || '?'
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800">{review.authorNickname || '익명'}</p>
                        {review.companionTitle && (
                          <span className="px-2.5 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-semibold line-clamp-1 max-w-[120px]">
                            {review.companionTitle}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mt-0.5">{review.createdAt}</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1">{review.title}</h3>
                  <p className="text-slate-600 leading-relaxed line-clamp-2 mb-4">"{review.content}"</p>
                  <StarRating rating={review.rating} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
