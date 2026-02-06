import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[70vh] min-h-[500px] pt-16">
      {heroSlides.map((slide, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-100' : 'opacity-0'}`}>
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-sky-900/60 via-sky-900/10 to-sky-900/15" />
      
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-5 pb-40">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full mb-5 border border-white/30">
          <span className="text-sm">🏝️</span>
          <span className="text-white/90 text-xs font-medium">자연이 당신을 기다려요</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-gmarket font-bold text-white mb-6 leading-snug drop-shadow-lg">
          파도 소리와 함께,<br />
          <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 bg-clip-text text-transparent">나만의 시간</span>
        </h1>
        
        <p className="text-xl text-white/80 mb-12 max-w-lg leading-relaxed drop-shadow">
          푸른 바다 앞에 서면 모든 걱정이 사라져요<br />
          혼자여서 더 자유로운 제주 여행
        </p>

        <div className="flex gap-4">
          <button className="group px-8 py-4 bg-white text-sky-600 font-semibold rounded-2xl shadow-xl shadow-sky-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2">
            <span>숙소 둘러보기</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <button className="px-8 py-4 bg-white/15 backdrop-blur text-white font-semibold rounded-2xl border border-white/40 hover:bg-white/25 transition-all">
            동행 찾기
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <div className="bg-gradient-to-t from-sky-900/80 to-transparent pt-24 pb-8">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex justify-center gap-16 md:gap-24 mb-8">
              {[
                { num: '3,000+', label: '숙소', icon: '🏠' },
                { num: '10,000+', label: '동행', icon: '👥' },
                { num: '4.9', label: '별점', icon: '⭐' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-2">
                    <span className="text-2xl">{stat.icon}</span>
                    {stat.num}
                  </p>
                  <p className="text-sky-200 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-2">
              {heroSlides.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-10 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}