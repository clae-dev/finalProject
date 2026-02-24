/**
 * 메인 홈페이지 컴포넌트 - 히어로, 명소+지도, 동행, 숙소, 후기 섹션 구성
 */
import React from 'react';
import Header from './common/Header';
import HeroSection from './main/HeroSection';
import SpotsMapSection from './main/SpotsMapSection';
import WaveDivider from './main/WaveDivider';
import CompanionsSection from './main/CompanionsSection';
import AccommodationsSection from './main/AccommodationsSection';
import ReviewsSection from './main/ReviewsSection';
import CTASection from './main/CTASection';
import Footer from './main/Footer';

export default function Main() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-cyan-50 overflow-x-hidden">
      <Header />
      <HeroSection />
      <SpotsMapSection />
      <CompanionsSection />
      <AccommodationsSection />
      <ReviewsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
