import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Star, Building2, UserPlus, Loader2 } from 'lucide-react';
import { useDashboard } from '../../api/admin/useAdmin';

const statCards = [
  { key: 'memberCount', label: '전체 회원', icon: Users, color: 'sky' },
  { key: 'companionCount', label: '동행 게시글', icon: FileText, color: 'emerald' },
  { key: 'reviewCount', label: '후기', icon: Star, color: 'amber' },
  { key: 'accommodationCount', label: '숙소', icon: Building2, color: 'violet' },
];

const colorMap = {
  sky: {
    bg: 'bg-gradient-to-br from-sky-400 to-cyan-400',
    shadow: 'shadow-sky-200/50',
    text: 'text-sky-600',
    light: 'bg-sky-50',
  },
  emerald: {
    bg: 'bg-gradient-to-br from-emerald-400 to-teal-400',
    shadow: 'shadow-emerald-200/50',
    text: 'text-emerald-600',
    light: 'bg-emerald-50',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-400 to-orange-400',
    shadow: 'shadow-amber-200/50',
    text: 'text-amber-600',
    light: 'bg-amber-50',
  },
  violet: {
    bg: 'bg-gradient-to-br from-violet-400 to-purple-400',
    shadow: 'shadow-violet-200/50',
    text: 'text-violet-600',
    light: 'bg-violet-50',
  },
};

function CountUp({ end }) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!end) return;
    let start = 0;
    const duration = 1200;
    const step = Math.max(1, Math.floor(end / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <>{count.toLocaleString()}</>;
}

export default function AdminDashboard() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
          <Loader2 className="w-10 h-10 text-sky-400" />
        </motion.div>
        <p className="text-slate-400 text-sm font-medium">통계를 불러오고 있어요...</p>
      </div>
    );
  }

  const stats = data?.data || {};
  const recentMembers = stats.recentMembers || [];

  return (
    <div className="space-y-8">
      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const colors = colorMap[card.color];
          const value = stats[card.key] || 0;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 p-6 group"
            >
              <div className={`w-12 h-12 ${colors.bg} rounded-2xl flex items-center justify-center mb-4 shadow-md ${colors.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-slate-400 mb-1 font-pretendard">{card.label}</p>
              <p className={`text-3xl font-black ${colors.text}`} className="font-gmarket">
                <CountUp end={value} />
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* 오늘 가입자 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 p-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-sky-400 rounded-xl flex items-center justify-center shadow-md shadow-sky-200/50">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 font-pretendard">오늘 가입</p>
            <p className="text-2xl font-black text-sky-600 font-gmarket">
              <CountUp end={stats.todaySignupCount || 0} />
              <span className="text-sm font-semibold text-slate-400 ml-1">명</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* 최근 가입 회원 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-sky-100 border border-sky-50 overflow-hidden"
      >
        <div className="p-6 pb-4">
          <h3 className="text-lg font-bold text-slate-800 font-gmarket">최근 가입 회원</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sky-50/80">
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">프로필</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">닉네임</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">이메일</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-slate-600">가입일</th>
              </tr>
            </thead>
            <tbody>
              {recentMembers.map((member) => (
                <tr key={member.memberNo} className="border-t border-sky-50 hover:bg-sky-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden">
                      {member.memberProfileImg ? (
                        <img src={member.memberProfileImg} alt="" referrerPolicy="no-referrer" loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        member.memberNickname?.[0] || '?'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-slate-700">{member.memberNickname}</td>
                  <td className="px-6 py-3 text-sm text-slate-500">{member.memberEmail}</td>
                  <td className="px-6 py-3 text-sm text-slate-400">{member.createdAt ? String(member.createdAt).substring(0, 10) : ''}</td>
                </tr>
              ))}
              {recentMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400 text-sm">가입 회원이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
