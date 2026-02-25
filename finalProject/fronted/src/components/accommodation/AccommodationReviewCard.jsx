import React, { useState } from 'react';
import { Star, Trash2, ChevronLeft, ChevronRight, Calendar, Users, ShieldCheck } from 'lucide-react';

export default function AccommodationReviewCard({ review, currentUserNo, onDelete }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = review.images || [];
  const isAuthor = currentUserNo === review.memberNo;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
      {/* 작성자 정보 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-cyan-100 overflow-hidden flex items-center justify-center">
            {review.authorProfileImg ? (
              <img src={review.authorProfileImg} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-sky-600">
                {review.authorNickname?.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">{review.authorNickname}</span>
              {review.verifiedReviewer === 'Y' && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  인증
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
              <span className="text-xs text-slate-400 ml-1">{review.createdAt}</span>
            </div>
          </div>
        </div>

        {isAuthor && onDelete && (
          <button
            onClick={() => {
              if (window.confirm('후기를 삭제하시겠습니까?')) {
                onDelete(review.reviewNo);
              }
            }}
            className="p-1.5 text-slate-300 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 이미지 슬라이더 */}
      {images.length > 0 && (
        <div className="relative rounded-lg overflow-hidden mb-3 bg-slate-100">
          <img
            src={images[imgIndex]?.imageUrl}
            alt={`후기 이미지 ${imgIndex + 1}`}
            className="w-full h-48 object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setImgIndex(i => (i + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i === imgIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 후기 내용 */}
      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{review.content}</p>

      {/* 메타 정보 */}
      <div className="flex flex-wrap gap-2 mt-3">
        {review.checkInDate && review.checkOutDate && (
          <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
            <Calendar className="w-3 h-3" />
            {review.checkInDate} ~ {review.checkOutDate}
          </span>
        )}
        {review.recommendedFor && (
          <span className="inline-flex items-center gap-1 text-xs text-sky-500 bg-sky-50 px-2 py-1 rounded-md">
            <Users className="w-3 h-3" />
            {review.recommendedFor}
          </span>
        )}
      </div>
    </div>
  );
}
