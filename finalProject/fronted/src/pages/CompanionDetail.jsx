import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Users, MapPin, Loader2, Check, X, Trash2, Heart, Share2, ImageIcon } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/main/Footer';
import { useCompanionDetail, useJoinCompanion, useCancelJoin, useUpdateJoinStatus, useDeleteCompanion } from '../api/useCompanion';
import { AuthContext } from '../components/AuthContext';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800';

const STATUS_LABEL = { W: '대기중', A: '승인됨', R: '거절됨' };
const STATUS_COLOR = {
  W: 'bg-amber-50 text-amber-600 border border-amber-200',
  A: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  R: 'bg-red-50 text-red-500 border border-red-200',
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function CompanionDetail() {
  const { companionNo } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const [lightboxImg, setLightboxImg] = useState(null);

  const { data, isLoading } = useCompanionDetail(companionNo);
  const joinMutation = useJoinCompanion();
  const cancelMutation = useCancelJoin();
  const updateStatusMutation = useUpdateJoinStatus(Number(companionNo));
  const deleteMutation = useDeleteCompanion();

  const companion = data?.success ? data.data : null;
  const joinList = data?.success ? (data.joinList || []) : [];

  const isAuthor = user && companion && user.memberNo === companion.memberNo;
  const myJoin = user ? joinList.find(j => j.memberNo === user.memberNo) : null;
  const hasJoined = !!myJoin && myJoin.status !== 'R';

  const tagList = companion?.tags ? companion.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const contentImageList = companion?.contentImages
    ? companion.contentImages.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const handleJoin = async () => {
    if (!user) { alert('로그인이 필요합니다.'); navigate('/login'); return; }
    try { const r = await joinMutation.mutateAsync(Number(companionNo)); alert(r.message); }
    catch { alert('참여 신청 중 오류가 발생했습니다.'); }
  };

  const handleCancelJoin = async () => {
    if (!window.confirm('참여를 취소하시겠습니까?')) return;
    try { const r = await cancelMutation.mutateAsync(Number(companionNo)); alert(r.message); }
    catch { alert('참여 취소 중 오류가 발생했습니다.'); }
  };

  const handleUpdateStatus = async (joinNo, status) => {
    const label = status === 'A' ? '승인' : '거절';
    if (!window.confirm(`${label}하시겠습니까?`)) return;
    try { const r = await updateStatusMutation.mutateAsync({ joinNo, status }); alert(r.message); }
    catch { alert('처리 중 오류가 발생했습니다.'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const r = await deleteMutation.mutateAsync(Number(companionNo));
      if (r.success) { alert('삭제되었습니다.'); navigate('/companions'); }
      else alert(r.message);
    } catch { alert('삭제 중 오류가 발생했습니다.'); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
            <Loader2 className="w-10 h-10 text-sky-400" />
          </motion.div>
          <p className="text-slate-400 text-sm">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <Header />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-40">
          <div className="w-20 h-20 bg-sky-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <Search className="w-10 h-10 text-sky-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-3">존재하지 않는 게시글입니다</h2>
          <button onClick={() => navigate('/companions')} className="text-sky-500 hover:text-sky-600 font-semibold">
            목록으로 돌아가기
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      {/* 히어로 이미지 */}
      <div className="relative h-[350px] md:h-[450px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          src={companion.imageUrl || DEFAULT_IMAGE}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-slate-900/20 to-slate-900/10" />

        {/* 뒤로가기 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/companions')}
          className="absolute top-6 left-6 w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-xl flex items-center justify-center shadow-lg hover:bg-white hover:shadow-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </motion.button>

        {/* 히어로 하단 정보 */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            {tagList.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tagList.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white/90 rounded-full text-xs font-semibold border border-white/10">
                    #{tag}
                  </span>
                ))}
                {companion.status === 'C' && (
                  <span className="px-3 py-1 bg-red-500/80 backdrop-blur-sm text-white rounded-full text-xs font-bold">마감</span>
                )}
              </div>
            )}
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
              {companion.title}
            </h1>
          </motion.div>
        </div>

        {/* 하단 웨이브 */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(240 249 255)" d="M0,30 C360,55 720,10 1080,35 C1260,47 1380,25 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      {/* 본문 */}
      <div className="relative max-w-4xl mx-auto px-5 pt-4 pb-16">
        {/* 장식 */}
        <div className="absolute top-20 right-0 w-60 h-60 bg-cyan-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-40 left-0 w-48 h-48 bg-sky-100/30 rounded-full blur-3xl -z-10" />

        {/* 작성자 + 여행정보 카드 */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 mb-6 border border-sky-50">

          {/* 작성자 */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-sky-50">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-400 via-cyan-400 to-teal-400 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-200/50 overflow-hidden">
              {companion.authorProfile ? (
                <img src={companion.authorProfile} alt="" className="w-full h-full object-cover" />
              ) : (
                companion.authorNickname?.[0] || '?'
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-lg">{companion.authorNickname}</p>
              <p className="text-sm text-slate-400">{companion.authorAgeRange} · {companion.createdAt}</p>
            </div>
            {isAuthor && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors border border-red-100"
              >
                <Trash2 className="w-4 h-4" />
                삭제
              </motion.button>
            )}
          </div>

          {/* 여행 정보 */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Calendar, label: '여행 일자', value: companion.travelDate || '미정', gradient: 'from-sky-400 to-cyan-400' },
              { icon: Users, label: '모집 현황', value: `${companion.currentMembers}/${companion.maxMembers}명`, gradient: 'from-cyan-400 to-teal-400' },
              { icon: MapPin, label: '상태', value: companion.status === 'Y' ? '모집중' : '마감', gradient: 'from-teal-400 to-emerald-400' },
            ].map(({ icon: Icon, label, value, gradient }, i) => (
              <motion.div key={label} variants={fadeUp} initial="hidden" animate="visible" custom={i + 1}
                className="relative group bg-gradient-to-br from-sky-50/80 to-cyan-50/50 rounded-2xl p-4 border border-sky-100/50 hover:shadow-lg hover:shadow-sky-100/30 transition-all duration-300"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{label}</p>
                <p className="text-base font-bold text-slate-700 mt-0.5">{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 본문 내용 */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 mb-6 border border-sky-50">
          <h3 className="text-sm font-bold text-sky-500 uppercase tracking-wider mb-4" style={{ fontFamily: "'Pretendard', sans-serif" }}>상세 내용</h3>
          <p className="text-slate-600 leading-[1.9] whitespace-pre-wrap text-[15px]">{companion.content}</p>
        </motion.div>

        {/* 본문 이미지 갤러리 */}
        {contentImageList.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 mb-6 border border-sky-50">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">여행 사진</h3>
              <span className="text-sm text-slate-400 ml-1">({contentImageList.length})</span>
            </div>
            <div className={`grid gap-3 ${contentImageList.length === 1 ? 'grid-cols-1' : contentImageList.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
              {contentImageList.map((imgUrl, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-md shadow-sky-100/30 ${contentImageList.length === 1 ? 'aspect-video' : 'aspect-square'}`}
                  onClick={() => setLightboxImg(imgUrl)}
                >
                  <img
                    src={imgUrl}
                    alt={`사진 ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-sky-900/0 group-hover:bg-sky-900/20 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 참여 버튼 */}
        {!isAuthor && companion.status === 'Y' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="mb-6">
            {hasJoined ? (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancelJoin}
                disabled={cancelMutation.isPending}
                className="w-full py-4 bg-white text-slate-600 font-bold rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
              >
                {cancelMutation.isPending ? '처리 중...' : '참여 취소'}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.01, boxShadow: '0 20px 40px -10px rgba(14, 165, 233, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoin}
                disabled={joinMutation.isPending}
                className="w-full py-4 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 text-white font-bold text-lg rounded-2xl shadow-lg shadow-sky-200/50 transition-all"
              >
                {joinMutation.isPending ? '처리 중...' : '참여 신청하기'}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* 참여자 목록 */}
        {joinList.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 border border-sky-50">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">참여 신청</h3>
              <span className="px-2.5 py-0.5 bg-sky-100 text-sky-600 rounded-full text-xs font-bold">{joinList.length}</span>
            </div>
            <div className="space-y-3">
              {joinList.map((join, idx) => (
                <motion.div
                  key={join.joinNo}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className="flex items-center justify-between bg-gradient-to-r from-sky-50/50 to-transparent rounded-2xl p-4 hover:from-sky-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-sky-200/30 overflow-hidden">
                      {join.memberProfile ? (
                        <img src={join.memberProfile} alt="" className="w-full h-full object-cover" />
                      ) : (
                        join.memberNickname?.[0] || '?'
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{join.memberNickname}</p>
                      <p className="text-xs text-slate-400">{join.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${STATUS_COLOR[join.status] || 'bg-slate-100 text-slate-500'}`}>
                      {STATUS_LABEL[join.status] || join.status}
                    </span>
                    {isAuthor && join.status === 'W' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUpdateStatus(join.joinNo, 'A')}
                          className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors border border-emerald-200"
                        >
                          <Check className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUpdateStatus(join.joinNo, 'R')}
                          className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors border border-red-200"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 이미지 라이트박스 */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-5"
            onClick={() => setLightboxImg(null)}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={lightboxImg}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <button className="absolute top-6 right-6 w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function Search({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
