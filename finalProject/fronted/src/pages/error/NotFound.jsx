import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/common/Header';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-gradient-to-b from-sky-50 via-cyan-50 to-blue-100">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-lg mx-auto"
        >
          {/* Wave + Boat SVG */}
          <div className="relative mb-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 200 120" className="w-48 h-auto mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Boat */}
                <path d="M70 55 L100 35 L130 55 Z" fill="#F97316" opacity="0.9" />
                <rect x="97" y="30" width="6" height="30" rx="2" fill="#92400E" />
                <path d="M55 60 Q75 50 100 58 Q125 50 145 60 L140 75 Q120 70 100 75 Q80 70 60 75 Z" fill="#0EA5E9" opacity="0.8" />
                {/* Waves */}
                <motion.path
                  d="M10 85 Q30 75 50 85 Q70 95 90 85 Q110 75 130 85 Q150 95 170 85 Q190 75 200 85"
                  stroke="#38BDF8" strokeWidth="3" fill="none" strokeLinecap="round"
                />
                <motion.path
                  d="M0 95 Q20 87 40 95 Q60 103 80 95 Q100 87 120 95 Q140 103 160 95 Q180 87 200 95"
                  stroke="#7DD3FC" strokeWidth="2.5" fill="none" strokeLinecap="round"
                />
                <motion.path
                  d="M5 105 Q25 98 45 105 Q65 112 85 105 Q105 98 125 105 Q145 112 165 105 Q185 98 200 105"
                  stroke="#BAE6FD" strokeWidth="2" fill="none" strokeLinecap="round"
                />
              </svg>
            </motion.div>
          </div>

          {/* 404 Number */}
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600"
            style={{ fontFamily: 'GmarketSans, sans-serif' }}
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-2xl font-bold text-gray-800"
            style={{ fontFamily: 'GmarketSans, sans-serif' }}
          >
            페이지를 찾을 수 없어요
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-gray-500 leading-relaxed"
          >
            길을 잃은 것 같아요.<br />
            요청하신 페이지가 존재하지 않거나, 이동되었을 수 있어요.
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
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              홈으로 돌아가기
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              이전 페이지로
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
