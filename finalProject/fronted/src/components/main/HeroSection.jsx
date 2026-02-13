import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import slideNoeul from '../../assets/images/main/노을.png';
import slideSseolmae from '../../assets/images/main/썰매.png';
import slideChingu from '../../assets/images/main/친구.png';

const heroSlides = [
  { image: slideNoeul, location: '협재해수욕장' },
  { image: slideSseolmae, location: '우도' },
  { image: slideChingu, location: '성산일출봉' },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] min-h-[600px]">
      {/* 슬라이드 배경 */}
      {heroSlides.map((slide, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}>
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-5">
        <p
          className="text-white/70 text-sm tracking-[0.3em] uppercase mb-6"
          style={{ fontFamily: "'Pretendard', sans-serif" }}
        >
          Jeju Island Travel
        </p>

        <h1
          className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-lg"
          style={{ fontFamily: "'GmarketSans', sans-serif" }}
        >
          파도 소리와 함께:
        </h1>
        <h1
          className="text-4xl md:text-6xl font-black mb-8 leading-tight drop-shadow-lg bg-gradient-to-r from-cyan-300 to-sky-300 bg-clip-text text-transparent"
          style={{ fontFamily: "'GmarketSans', sans-serif" }}
        >
          나만의 시간
        </h1>

        <p
          className="text-lg text-white/80 mb-12 max-w-md leading-relaxed drop-shadow"
          style={{ fontFamily: "'Pretendard', sans-serif" }}
        >
          혼자여서 더 자유로운 제주 여행
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/accommodations')}
            className="group px-8 py-3.5 bg-white text-sky-600 font-bold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            숙소 둘러보기
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </button>
          <button
            onClick={() => navigate('/companions')}
            className="px-8 py-3.5 bg-white/15 backdrop-blur-sm text-white font-bold rounded-full border border-white/30 hover:bg-white/25 transition-all duration-300"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            동행 찾기
          </button>
        </div>
      </div>

      {/* 하단: 슬라이드 인디케이터 */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="flex justify-center">
          <div className="flex gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentSlide === idx ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
          </div>
      </div>
    </section>
  );
}
