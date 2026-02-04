import React from 'react';
import WaveDivider from './ui/WaveDivider';  // base44에서 가져옴
import { Card } from './ui/card';             // base44에서 가져옴

function Main() {
  const { user, handleLogout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 기존 Top Banner */}
      <div className="bg-jeju-600 text-white text-center py-2">
        첫 방문 회원 특별 혜택
      </div>

      {/* 기존 Header - glassmorphism 효과만 추가 */}
      <header className="bg-white/70 backdrop-blur-xl border-b sticky top-0 z-50">
        {/* 기존 코드 유지 */}
      </header>

      {/* 기존 Hero Section */}
      <section className="py-20 bg-gradient-to-br from-jeju-50 to-emerald-50">
        {/* 검색 바 */}
      </section>

      {/* 새로운 물결 구분선 (base44) */}
      <WaveDivider bgColor="bg-white" fillColor="#d1fae5" />

      {/* 숙소 섹션 - Card 컴포넌트로 개선 */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl font-bold mb-8">추천 숙소</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accommodations.map(acc => (
              <Card key={acc.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                {/* 카드 내용 */}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 기존 다른 섹션들 */}
    </div>
  );
}