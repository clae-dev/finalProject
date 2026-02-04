import React from 'react';

const guesthouses = [
  { id: 1, name: '파도소리 게스트하우스', location: '제주시 애월', price: '35,000', rating: 4.9, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500', vibe: '오션뷰' },
  { id: 2, name: '푸른바다 스테이', location: '서귀포 성산', price: '42,000', rating: 4.8, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500', vibe: '감성숙소' },
  { id: 3, name: '해변의 아침', location: '제주시 함덕', price: '38,000', rating: 4.7, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500', vibe: '조용한' },
];

export default function AccommodationsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full text-sm font-semibold text-amber-600 mb-4">
            <span>🏠</span> STAY
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">혼행에 딱 맞는 숙소</h2>
          <p className="text-slate-500 mt-3">파도 소리 들으며 편안한 하룻밤</p>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {guesthouses.map(gh => (
            <div key={gh.id} className="group cursor-pointer">
              <div className="relative rounded-3xl overflow-hidden mb-5 shadow-lg shadow-sky-50 group-hover:shadow-xl group-hover:shadow-sky-100 transition-all">
                <div className="aspect-[4/3]">
                  <img src={gh.image} alt={gh.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <button className="absolute top-4 right-4 w-11 h-11 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-slate-400 hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="px-4 py-2 bg-white/95 backdrop-blur rounded-full text-sm font-semibold text-sky-600 shadow-lg">
                    {gh.vibe}
                  </span>
                </div>
              </div>
              <div className="px-2">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-800 text-lg">{gh.name}</h3>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-amber-600 text-sm">{gh.rating}</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-3">📍 {gh.location}</p>
                <p className="text-xl font-bold text-slate-800">₩{gh.price} <span className="text-sm font-normal text-slate-400">/ 박</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}