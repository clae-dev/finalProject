import React, { useState } from 'react';

const companions = [
  { id: 1, title: '2/15 우도 같이 자전거 타실 분!', author: '하늘', age: '20대 여', date: '2.15(토)', members: '1/4', tags: ['우도', '자전거'], dday: 'D-12', image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400' },
  { id: 2, title: '성산일출봉 일출 보러 가요 🌅', author: '민재', age: '30대 남', date: '2.10(월)', members: '2/3', tags: ['일출', '트레킹'], dday: 'D-7', image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=400' },
  { id: 3, title: '애월 카페 투어 함께해요 ☕', author: '수진', age: '20대 여', date: '2.12(수)', members: '0/2', tags: ['카페', '애월'], dday: 'D-9', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400' },
  { id: 4, title: '올레길 7코스 같이 걸어요', author: '준호', age: '30대 남', date: '2.14(금)', members: '1/2', tags: ['올레길', '트레킹'], dday: 'D-11', image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400' },
  { id: 5, title: '흑돼지 먹으러 가실 분~', author: '예린', age: '20대 여', date: '2.11(화)', members: '2/4', tags: ['맛집', '흑돼지'], dday: 'D-8', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' },
];

export default function CompanionsSection() {
  const [companionSlide, setCompanionSlide] = useState(0);

  const nextCompanion = () => setCompanionSlide(prev => Math.min(prev + 1, companions.length - 3));
  const prevCompanion = () => setCompanionSlide(prev => Math.max(prev - 1, 0));

  return (
    <section className="py-20 bg-gradient-to-b from-cyan-100 via-sky-50 to-white relative">
      <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-200 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-sky-200 rounded-full blur-3xl opacity-50" />
      
      <div className="max-w-6xl mx-auto px-5 relative">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-semibold text-sky-600 shadow-sm mb-4">
              <span>👥</span> 동행 모집
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">함께라서 더 특별한</h2>
            <p className="text-slate-500 mt-3">지금 모집 중인 동행에 참여해보세요</p>
          </div>
          <div className="flex gap-3">
            <button onClick={prevCompanion} disabled={companionSlide === 0}
              className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100 flex items-center justify-center text-sky-500 hover:text-sky-600 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextCompanion} disabled={companionSlide >= companions.length - 3}
              className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100 flex items-center justify-center text-sky-500 hover:text-sky-600 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="flex gap-5 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${companionSlide * 340}px)` }}>
            {companions.map(comp => (
              <div key={comp.id} className="flex-shrink-0 w-80 bg-white rounded-3xl overflow-hidden shadow-lg shadow-sky-100 hover:shadow-xl hover:shadow-sky-200 hover:-translate-y-2 transition-all duration-300 cursor-pointer group border border-sky-50">
                <div className="relative h-44 overflow-hidden">
                  <img src={comp.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <span className="absolute top-4 right-4 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-sky-500 shadow-lg">
                    {comp.dday}
                  </span>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {comp.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-600">#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-800 text-lg mb-4 line-clamp-1">{comp.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-sky-200">
                        {comp.author[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{comp.author}</p>
                        <p className="text-xs text-slate-400">{comp.age}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-sky-500">{comp.members}</p>
                      <p className="text-xs text-slate-400">{comp.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}