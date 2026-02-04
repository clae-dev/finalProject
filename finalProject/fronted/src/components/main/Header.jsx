import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/70 backdrop-blur-xl border-b border-sky-100">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold cursor-pointer flex items-center gap-1">
              <span className="text-sky-500">혼</span>
              <span className="text-cyan-400">디</span>
              <span className="text-2xl">🌊</span>
            </h1>
            <nav className="hidden md:flex items-center gap-8">
              {['홈', '숙소', '동행', '후기', '맛집'].map((item, idx) => (
                <button key={item} className={`text-sm font-medium transition-colors ${idx === 0 ? 'text-sky-600' : 'text-slate-500 hover:text-sky-500'}`}>
                  {item}
                </button>
              ))}
            </nav>
            <button className="px-5 py-2 bg-gradient-to-r from-sky-400 to-cyan-400 text-white text-sm font-semibold rounded-full shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 transition-all">
              로그인
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}