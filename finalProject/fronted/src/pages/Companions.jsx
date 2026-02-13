import React from 'react';
import { Users, MapPin, Calendar } from 'lucide-react';
import Header from '../components/common/Header';

export default function Companions() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* 히어로 */}
      <div className="relative h-[350px] bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-400 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/15 backdrop-blur-md rounded-full text-sm font-semibold mb-6 border border-white/20">
            <Users className="w-4 h-4" />
            <span>제주 동행 찾기</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">
            함께라서 더 특별한 제주
          </h1>
          <p className="text-base md:text-lg text-white/80 text-center max-w-xl">
            혼자여도 괜찮아요. 같은 길을 걷는 동행을 만나보세요.
          </p>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">동행 서비스 준비 중</h2>
          <p className="text-slate-500">곧 멋진 동행 매칭 기능으로 찾아뵙겠습니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-sky-500" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">동행 매칭</h3>
            <p className="text-sm text-slate-500">관심사와 여행 스타일이 비슷한 동행을 추천해드려요</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-teal-500" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">코스 공유</h3>
            <p className="text-sm text-slate-500">나만의 제주 여행 코스를 동행과 함께 계획해요</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-7 h-7 text-violet-500" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">일정 조율</h3>
            <p className="text-sm text-slate-500">여행 일정을 맞추고 함께하는 시간을 만들어요</p>
          </div>
        </div>
      </div>
    </div>
  );
}
