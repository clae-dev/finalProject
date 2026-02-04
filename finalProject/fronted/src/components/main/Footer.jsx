import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-400 py-14">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          <div>
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <span className="text-sky-400">혼</span>
              <span className="text-cyan-300">디</span>
              <span>🌊</span>
            </h3>
            <p className="text-sm leading-relaxed">제주 바다처럼 자유로운<br />혼자 여행자들의 커뮤니티</p>
          </div>
          <div className="flex gap-16">
            <div>
              <h4 className="text-white font-semibold mb-4">서비스</h4>
              <ul className="space-y-2.5 text-sm">
                {['숙소', '동행찾기', '여행후기', '맛집'].map(item => (
                  <li key={item}><button className="hover:text-sky-300 transition-colors">{item}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">고객지원</h4>
              <ul className="space-y-2.5 text-sm">
                {['자주 묻는 질문', '문의하기', '이용약관'].map(item => (
                  <li key={item}><button className="hover:text-sky-300 transition-colors">{item}</button></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-sm text-center text-slate-500">© 2025 혼디. All rights reserved.</div>
      </div>
    </footer>
  );
}