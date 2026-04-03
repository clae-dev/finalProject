import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/common/Header';

export default function ServerError() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-gradient-to-b from-gray-100 via-slate-100 to-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-lg mx-auto"
        >
          {/* Storm Cloud + Lightning SVG */}
          <div className="relative mb-6">
            <motion.div
              animate={{ x: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 200 130" className="w-48 h-auto mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Cloud */}
                <ellipse cx="100" cy="45" rx="55" ry="30" fill="#94A3B8" opacity="0.7" />
                <ellipse cx="70" cy="50" rx="35" ry="22" fill="#94A3B8" opacity="0.8" />
                <ellipse cx="130" cy="48" rx="38" ry="24" fill="#94A3B8" opacity="0.75" />
                <ellipse cx="100" cy="55" rx="50" ry="20" fill="#64748B" opacity="0.6" />
                {/* Lightning */}
                <motion.path
                  d="M95 65 L88 85 L97 82 L90 105"
                  stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
                  animate={{ opacity: [1, 0.3, 1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.path
                  d="M115 68 L110 84 L117 81 L112 98"
                  stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
                  animate={{ opacity: [0.3, 1, 0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Rain */}
                {[45, 65, 85, 105, 125, 145].map((x, i) => (
                  <motion.line
                    key={i}
                    x1={x} y1={70 + (i % 3) * 5} x2={x - 3} y2={80 + (i % 3) * 5}
                    stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round"
                    animate={{ y: [0, 15, 0], opacity: [0.7, 0.3, 0.7] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
                {/* Rough Waves */}
                <path
                  d="M10 115 Q25 105 45 115 Q60 125 80 112 Q100 100 120 115 Q140 125 160 112 Q180 105 200 115"
                  stroke="#64748B" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"
                />
                <path
                  d="M0 125 Q20 118 40 125 Q60 130 80 122 Q100 115 120 125 Q140 130 160 122 Q180 118 200 125"
                  stroke="#94A3B8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4"
                />
              </svg>
            </motion.div>
          </div>

          {/* 500 Number */}
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-gray-700 font-gmarket"
          >
            500
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-2xl font-bold text-gray-800 font-gmarket"
          >
            서버에 문제가 생겼어요
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-gray-500 leading-relaxed"
          >
            잠시 폭풍우가 지나가고 있어요.<br />
            잠시 후 다시 시도해 주세요.
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
              className="px-6 py-3 bg-gradient-to-r from-slate-500 to-gray-600 text-white font-semibold rounded-xl shadow-lg shadow-slate-500/25 hover:shadow-slate-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              홈으로 돌아가기
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              다시 시도
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
