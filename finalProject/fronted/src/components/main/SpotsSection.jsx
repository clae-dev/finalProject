import React from 'react';

const spots = [
  { id: 1, title: '월정리 해변', desc: '에메랄드빛 투명한 바다', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', tag: '🔥 인기' },
  { id: 2, title: '협재해수욕장', desc: '새하얀 모래와 옥빛 바다', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600', tag: '🏖 해변' },
  { id: 3, title: '성산일출봉', desc: '장엄한 일출 명소', image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600', tag: '🌅 일출' },
  { id: 4, title: '우도', desc: '섬 속의 작은 섬', image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600', tag: '🚲 우도' },
];

export default function SpotsSection() {
  return (
    <section className="relative bg-white pt-16 pb-20">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-full text-sm font-semibold text-sky-600 mb-4">
            <span>🌊</span> HOT PLACE
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">혼행러들이 사랑한 명소</h2>
          <p className="text-slate-500 mt-3">푸른 바다와 함께하는 특별한 순간들</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {spots.map((spot, idx) => (
            <div key={spot.id} className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg shadow-sky-100 hover:shadow-xl hover:shadow-sky-200 transition-all duration-300 ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}>
              <div className={`relative ${idx === 0 ? 'h-full' : 'aspect-[3/4]'}`}>
                <img src={spot.image} alt={spot.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-700 shadow-sm">
                    {spot.tag}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className={`font-bold text-white drop-shadow-lg ${idx === 0 ? 'text-3xl' : 'text-xl'}`}>{spot.title}</h3>
                  <p className="text-white/80 mt-2 drop-shadow">{spot.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}