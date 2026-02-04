import React from 'react';

export default function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-500" />
      <div className="absolute inset-0 opacity-20">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path fill="white" d="M0,100 C200,150 400,50 600,100 C800,150 1000,50 1200,100 C1350,130 1440,80 1440,80 L1440,200 L0,200 Z" />
        </svg>
      </div>
      <div className="absolute top-10 left-20 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
      
      <div className="relative max-w-4xl mx-auto px-5 text-center">
        <p className="text-5xl mb-6">🌊</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
          파도가 부르는 소리,<br />들리시나요?
        </h2>
        <p className="text-xl text-white/90 mb-10 leading-relaxed">
          제주 바다가 당신을 기다리고 있어요<br />
          지금 바로 나만의 여행을 시작해보세요
        </p>
        <button className="group px-10 py-5 bg-white text-sky-600 font-bold text-lg rounded-2xl shadow-2xl shadow-sky-900/30 hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto">
          <span>여행 시작하기</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </section>
  );
}