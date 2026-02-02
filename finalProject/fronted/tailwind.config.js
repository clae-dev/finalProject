/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 제주 바다 블루 - 메인 컬러
        jeju: {
          50: '#e8f4f8',
          100: '#d1e9f1',
          200: '#a3d3e3',
          300: '#75bdd5',
          400: '#47a7c7',
          500: '#2E8BC0',
          600: '#256f9a',
          700: '#1c5373',
          800: '#13374d',
          900: '#0a1b26',
        },
        // 에메랄드 - 서브 컬러 (Tailwind 기본 emerald 사용)
      },
      animation: {
        'fadeIn': 'fadeIn 0.4s ease-out',
        'wave': 'wave 1s ease-in-out infinite',
        'gradientShift': 'gradientShift 15s ease infinite',
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
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
