import React from 'react';

const reviews = [
  { id: 1, author: '혜진', badge: '혼행 3회', content: '게스트하우스에서 만난 언니랑 다음날 우도도 같이 갔어요. 혼자 왔는데 친구 생겼어요 ㅎㅎ', spot: '월정리', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: 2, author: '민수', badge: '혼행 7회', content: '파도 소리 들으면서 멍때리기 최고... 복잡한 머리가 맑아지는 느낌이에요', spot: '협재', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: 3, author: '수아', badge: '첫 혼행', content: '처음엔 무서웠는데 막상 오니까 나만의 시간이 너무 소중하게 느껴졌어요!', spot: '애월', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
];

export default function ReviewsSection() {
  return (
    <section className="py-20 bg-sky-50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-semibold text-rose-500 shadow-sm mb-4">
            <span>💬</span> REAL REVIEW
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">혼행러들의 솔직한 후기</h2>
          <p className="text-slate-500 mt-3">직접 다녀온 분들의 생생한 이야기</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-3xl p-7 shadow-lg shadow-sky-100 hover:shadow-xl hover:shadow-sky-200 hover:-translate-y-1 transition-all border border-sky-50">
              <div className="flex items-center gap-4 mb-5">
                <img src={review.image} alt={review.author} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-sky-50" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-800">{review.author}</p>
                    <span className="px-2.5 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-semibold">{review.badge}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-0.5">🏖️ {review.spot}에서</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">"{review.content}"</p>
              <div className="flex mt-5 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}