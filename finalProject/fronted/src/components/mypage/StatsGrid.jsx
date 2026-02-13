import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Bookmark, Users } from 'lucide-react';

const getStats = (memberData) => [
  { label: '작성글', icon: FileText, value: memberData?.postCount || 0, bg: 'bg-sky-50', text: 'text-sky-600' },
  { label: '후기', icon: MessageSquare, value: memberData?.reviewCount || 0, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { label: '스크랩', icon: Bookmark, value: memberData?.scrapCount || 0, bg: 'bg-amber-50', text: 'text-amber-600' },
  { label: '동행 참여', icon: Users, value: memberData?.companionCount || 0, bg: 'bg-violet-50', text: 'text-violet-600' },
];

function CountUp({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        ref.current = requestAnimationFrame(step);
      }
    };
    ref.current = requestAnimationFrame(step);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [target, duration]);

  return <span>{count}</span>;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function StatsGrid({ memberData }) {
  const stats = getStats(memberData);

  return (
    <section className="py-12 px-5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg shadow-sky-100 border border-sky-50
                           hover:shadow-xl hover:shadow-sky-200 transition-shadow cursor-default"
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.text}`} />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
                  <CountUp target={stat.value} />
                </div>
                <div className="text-sm text-slate-500 font-medium" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
