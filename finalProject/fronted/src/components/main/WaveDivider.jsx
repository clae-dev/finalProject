import React from 'react';

export default function WaveDivider({ bgColor = 'bg-white', fillColor = '#e0f7fa' }) {
  return (
    <div className={`relative h-20 ${bgColor}`}>
      <svg className="absolute bottom-0 w-full h-20" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path fill={fillColor} d="M0,30 C200,60 400,0 600,30 C800,60 1000,10 1200,40 C1350,60 1440,30 1440,30 L1440,80 L0,80 Z" />
      </svg>
    </div>
  );
}