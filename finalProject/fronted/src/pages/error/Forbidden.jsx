import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/common/Header';

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-lg mx-auto"
        >
          {/* Lock + Forbidden Island SVG */}
          <div className="relative mb-6">
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 200 130" className="w-48 h-auto mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Island */}
                <ellipse cx="100" cy="100" rx="65" ry="15" fill="#FCD34D" opacity="0.5" />
                <path d="M60 100 Q80 75 100 100 Q120 75 140 100" fill="#F59E0B" opacity="0.3" />
                {/* Palm tree */}
                <rect x="97" y="60" width="6" height="42" rx="3" fill="#92400E" />
                <path d="M100 62 Q80 50 70 58" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M100 62 Q120 48 132 56" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M100 58 Q85 42 75 48" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                {/* Lock */}
                <rect x="82" y="20" width="36" height="28" rx="5" fill="#EF4444" opacity="0.85" />
                <path d="M92 20 L92 12 Q92 4 100 4 Q108 4 108 12 L108 20" stroke="#DC2626" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <circle cx="100" cy="32" r="4" fill="white" opacity="0.9" />
                <rect x="98.5" y="34" width="3" height="6" rx="1.5" fill="white" opacity="0.9" />
                {/* Forbidden sign */}
                <circle cx="100" cy="30" r="20" stroke="#DC2626" strokeWidth="2" fill="none" opacity="0.3" />
                {/* Water */}
                <path
                  d="M15 115 Q35 108 55 115 Q75 122 95 115 Q115 108 135 115 Q155 122 175 115 Q195 108 200 112"
                  stroke="#38BDF8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4"
                />
              </svg>
            </motion.div>
          </div>

          {/* 403 Number */}
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500"
            style={{ fontFamily: 'GmarketSans, sans-serif' }}
          >
            403
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-2xl font-bold text-gray-800"
            style={{ fontFamily: 'GmarketSans, sans-serif' }}
          >
            접근할 수 없는 페이지예요
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-gray-500 leading-relaxed"
          >
            이 섬에는 들어갈 수 없어요.<br />
            접근 권한이 없거나, 로그인이 필요할 수 있어요.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-red-400 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-red-400/25 hover:shadow-red-400/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              홈으로 돌아가기
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              로그인하기
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
