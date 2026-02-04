import React from 'react';
import Header from './components/main/Header';
import HeroSection from './components/main/HeroSection';
import SpotsSection from './components/main/SpotsSection';
import WaveDivider from './components/main/WaveDivider';
import CompanionsSection from './components/main/CompanionsSection';
import AccommodationsSection from './components/main/AccommodationsSection';
import ReviewsSection from './components/main/ReviewsSection';
import CTASection from './components/main/CTASection';
import Footer from './components/main/Footer';

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