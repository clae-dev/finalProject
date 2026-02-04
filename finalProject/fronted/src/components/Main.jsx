import React from 'react';
import Header from './main/Header';
import HeroSection from './main/HeroSection';
import SpotsSection from './main/SpotsSection';
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
      <SpotsSection />
      <WaveDivider bgColor="bg-white" fillColor="#e0f7fa" />
      <CompanionsSection />
      <AccommodationsSection />
      <WaveDivider bgColor="bg-white" fillColor="#f0f9ff" />
      <ReviewsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
