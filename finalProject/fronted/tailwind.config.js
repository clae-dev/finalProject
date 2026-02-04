/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // base44 스타일 토큰 추가
        jeju: {
          50: '#f0f9ff',
          100: '#e0f7fa',
          // ... 추가 색상
        },
      },
      animation: {
        'wave': 'wave 20s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          'from': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-25%)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}