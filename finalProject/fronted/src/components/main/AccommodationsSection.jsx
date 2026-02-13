import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full text-sm font-semibold text-amber-600 mb-4">
              <span>🏠</span> STAY
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">혼행에 딱 맞는 숙소</h2>
            <p className="text-slate-500 mt-3">파도 소리 들으며 편안한 하룻밤</p>
          </div>
          <div className="flex gap-3">
            <button onClick={prevSlide} disabled={slide === 0}
              className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100 flex items-center justify-center text-sky-500 hover:text-sky-600 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-slate-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextSlide} disabled={slide >= maxSlide}
              className="w-12 h-12 rounded-full bg-white shadow-lg shadow-sky-100 flex items-center justify-center text-sky-500 hover:text-sky-600 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-slate-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
          </div>
        )}

        {!isLoading && accommodations.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400">등록된 숙소가 없습니다</p>
          </div>
        )}

        {!isLoading && accommodations.length > 0 && (
          <div className="overflow-hidden">
            <div className="flex gap-7 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${slide * 340}px)` }}>
              {accommodations.map(acc => (
                <div
                  key={acc.accommodationNo}
                  onClick={() => navigate(`/accommodations/${acc.accommodationNo}`)}
                  className="flex-shrink-0 w-80 group cursor-pointer"
                >
                  <div className="relative rounded-3xl overflow-hidden mb-5 shadow-lg shadow-sky-50 group-hover:shadow-xl group-hover:shadow-sky-100 transition-all">
                    <div className="aspect-[4/3]">
                      <img
                        src={acc.thumbnailUrl || DEFAULT_IMAGE}
                        alt={acc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                      />
                    </div>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-4 right-4 w-11 h-11 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Heart className="w-5 h-5 text-slate-400 hover:text-rose-500 transition-colors" />
                    </button>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {acc.accommodationType && (
                        <span className="px-4 py-2 bg-white/95 backdrop-blur rounded-full text-sm font-semibold text-sky-600 shadow-lg">
                          {acc.accommodationType}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{acc.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="line-clamp-1">{acc.address || acc.region || ''}</span>
                    </div>
                    <p className="text-xl font-bold text-slate-800">
                      {formatPrice(acc.priceMin, acc.priceMax)}
                      <span className="text-sm font-normal text-slate-400"> / 박</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
