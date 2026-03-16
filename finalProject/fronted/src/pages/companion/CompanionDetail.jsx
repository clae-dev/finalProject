import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Users, MapPin, Loader2, Check, X, Trash2, ImageIcon, Flag, Map, Pencil } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import heroStar from '../../assets/images/companion/별.webp';
import heroFriends from '../../assets/images/companion/친구.webp';
import { useCompanionDetail, useJoinCompanion, useCancelJoin, useUpdateJoinStatus, useDeleteCompanion } from '../../api/companion/useCompanion';
import { useCheckReport, useSubmitReport } from '../../api/report/useReport';
import { AuthContext } from '../../components/AuthContext';
import WishlistButton from '../../components/common/WishlistButton';
import ImageLightbox from '../../components/common/ImageLightbox';
import ShareButtons from '../../components/common/ShareButtons';
import KakaoMap from '../../components/common/KakaoMap';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800';
const heroSlides = [heroStar, heroFriends];

const STATUS_LABEL = { W: '대기중', A: '승인됨', R: '거절됨' };
const STATUS_COLOR = {
  W: 'bg-amber-50 text-amber-600 border border-amber-200',
  A: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  R: 'bg-red-50 text-red-500 border border-red-200',
};

function formatTravelDate(travelDate) {
  if (!travelDate) return '';
  const isoMatch = travelDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const d = new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
    return `${d.getMonth() + 1}.${d.getDate()}(${days[d.getDay()]})`;
  }
  return travelDate;
}

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
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const [heroSlide, setHeroSlide] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading } = useCompanionDetail(companionNo);
  const joinMutation = useJoinCompanion();
  const cancelMutation = useCancelJoin();
  const updateStatusMutation = useUpdateJoinStatus(Number(companionNo));
  const deleteMutation = useDeleteCompanion();
  const { data: reportCheckData } = useCheckReport(user ? 'COMPANION' : null, user ? Number(companionNo) : null);
  const reportMutation = useSubmitReport('COMPANION', Number(companionNo));
  const alreadyReported = reportCheckData?.reported === true;

  const companion = data?.success ? data.data : null;
  const isAuthor = user && companion && Number(user.memberNo) === Number(companion.memberNo);
  const joinListRaw = data?.success ? (data.joinList || []) : [];
  const joinList = joinListRaw.filter(j => j.status !== 'R');
  const myJoin = user ? joinList.find(j => Number(j.memberNo) === Number(user.memberNo)) : null;
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

  const handleReportSubmit = async () => {
    if (!reportType) { alert('신고 유형을 선택해주세요.'); return; }
    try {
      const r = await reportMutation.mutateAsync({ reportType, detailReason: reportReason });
      if (r.success) { alert('신고가 접수되었습니다.'); setShowReportModal(false); setReportType(''); setReportReason(''); }
      else alert(r.message);
    } catch { alert('신고 접수 중 오류가 발생했습니다.'); }
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <Header />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-40">
          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-sky-500" />
          </div>
          <p className="text-slate-700 text-lg font-semibold mb-2">로그인이 필요합니다</p>
          <p className="text-slate-400 text-sm mb-6">동행 상세 내용은 회원만 볼 수 있습니다.</p>
          <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all">
            로그인하러 가기
          </button>
        </motion.div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      {/* 히어로 (메인과 동일) */}
      <div className="relative h-[480px] overflow-hidden">
        {heroSlides.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-[1500ms] ${heroSlide === idx ? 'opacity-100' : 'opacity-0'}`}>
            <motion.img
              src={img} alt=""
              className="w-full h-full object-cover"
              animate={{ scale: heroSlide === idx ? 1.05 : 1 }}
              transition={{ duration: 8, ease: 'linear' }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-cyan-900/20 to-slate-900/70" />

        <motion.div
          className="absolute top-20 left-[10%] w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-[10%] w-40 h-40 bg-sky-400/20 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <motion.p
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/50 text-sm tracking-[0.3em] uppercase mb-5 font-pretendard"
          >
            Jeju Companion
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-cyan-100 shadow-lg shadow-cyan-500/10"
          >
            <Users className="w-4 h-4 text-cyan-300" />
            <span className="font-pretendard">제주 동행 찾기</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl font-black mb-6 text-center leading-tight drop-shadow-lg font-gmarket"
          >
            <span className="text-white">함께라서 더 특별한 </span>
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">제주</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-white/70 text-center max-w-md leading-relaxed font-pretendard"
          >
            혼자여도 괜찮아요. 같은 길을 걷는 동행을 만나보세요.
          </motion.p>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button key={idx} onClick={() => setHeroSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${heroSlide === idx ? 'w-10 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>

        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(240 249 255)" d="M0,50 C300,80 600,20 900,50 C1100,70 1300,30 1440,45 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      {/* 본문 */}
      <div className="relative max-w-4xl mx-auto px-5 pt-4 pb-16">
        {/* 뒤로가기 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/companions')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-500 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로 돌아가기
        </motion.button>

        {/* 제목 + 태그 카드 */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 mb-6 border border-sky-50">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 font-gmarket">
            {companion.title}
          </h1>
          {(tagList.length > 0 || companion.status === 'C') && (
            <div className="flex flex-wrap gap-2">
              {tagList.map(tag => (
                <span key={tag} className="px-3.5 py-1.5 bg-gradient-to-r from-sky-50 to-cyan-50 text-sky-600 rounded-full text-xs font-semibold border border-sky-100">
                  #{tag}
                </span>
              ))}
              {companion.status === 'C' && (
                <span className="px-3.5 py-1.5 bg-red-50 text-red-500 rounded-full text-xs font-bold border border-red-100">마감</span>
              )}
            </div>
          )}
        </motion.div>

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
                <img src={companion.authorProfile} alt="" loading="lazy" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = companion.authorNickname?.[0] || '?'; }} />
              ) : (
                companion.authorNickname?.[0] || '?'
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-lg">{companion.authorNickname}</p>
              <p className="text-sm text-slate-400">{companion.authorAgeRange || '-'} · {companion.createdAt}</p>
            </div>
            {isAuthor && (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/companions/${companionNo}/edit`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-sky-50 text-sky-500 rounded-xl text-sm font-semibold hover:bg-sky-100 transition-colors border border-sky-100"
                >
                  <Pencil className="w-4 h-4" />
                  수정
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors border border-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </motion.button>
              </div>
            )}
            {user && !isAuthor && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alreadyReported ? null : setShowReportModal(true)}
                disabled={alreadyReported}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                  alreadyReported
                    ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-orange-50 text-orange-500 border-orange-100 hover:bg-orange-100'
                }`}
              >
                <Flag className="w-4 h-4" />
                {alreadyReported ? '신고 완료' : '신고'}
              </motion.button>
            )}
          </div>

          {/* 여행 정보 */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: Calendar, label: '여행 일자', value: formatTravelDate(companion.travelDate) || '미정', gradient: 'from-sky-400 to-cyan-400' },
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

          {/* 찜 + 공유 버튼 */}
          <div className="flex items-center gap-3 pt-4 border-t border-sky-50">
            <WishlistButton type="companion" targetNo={Number(companionNo)} size="md" />
            <ShareButtons
              title={companion.title}
              description={`${formatTravelDate(companion.travelDate)} · ${companion.currentMembers}/${companion.maxMembers}명`}
              imageUrl={companion.imageUrl}
            />
          </div>
        </motion.div>

        {/* 본문 내용 */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 mb-6 border border-sky-50">
          <h3 className="text-sm font-bold text-sky-500 uppercase tracking-wider mb-4 font-pretendard">상세 내용</h3>
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
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img
                    src={imgUrl}
                    alt={`사진 ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-sky-900/0 group-hover:bg-sky-900/20 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
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
                        <img src={join.memberProfile} alt="" loading="lazy" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = join.memberNickname?.[0] || '?'; }} />
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

        {/* 여행 지역 지도 */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
          className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 border border-sky-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Map className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">여행 지역</h3>
            {companion.placeName && (
              <span className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-semibold border border-sky-100">
                {companion.placeName}
              </span>
            )}
          </div>
          <KakaoMap
            lat={companion.latitude || 33.3617}
            lng={companion.longitude || 126.5292}
            level={companion.latitude ? 4 : 10}
            name={companion.placeName || '제주도'}
            height="200px"
          />
          <p className="text-xs text-slate-400 mt-2 text-center font-pretendard">
            {companion.placeName
              ? `${companion.placeName}에서 함께할 동행을 모집 중입니다`
              : '제주도 전체 지역에서 함께할 동행을 모집 중입니다'}
          </p>
        </motion.div>

        {/* 참여 버튼 */}
        {!isAuthor && companion.status === 'Y' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7} className="mt-6">
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
                className="w-full py-5 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 text-white font-bold text-lg rounded-2xl shadow-lg shadow-sky-200/50 transition-all"
              >
                {joinMutation.isPending ? '처리 중...' : '참여 신청하기'}
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* 이미지 라이트박스 */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={contentImageList}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* 신고 모달 */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-bold text-slate-800 font-pretendard">동행 신고</h3>
                </div>
                <button onClick={() => setShowReportModal(false)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* 동행 전용 신고 유형 — 실제 만남이 수반되므로 안전 관련 유형을 강화 */}
              <div className="space-y-3 mb-5">
                {[
                  { value: 'SPAM', label: '스팸/광고' },
                  { value: 'ABUSE', label: '욕설/비방' },
                  { value: 'FALSE_INFO', label: '허위 모집 정보' },
                  { value: 'NO_SHOW', label: '노쇼/잠수' },
                  { value: 'FRAUD', label: '사기/금전 요구' },
                  { value: 'DANGEROUS', label: '위험 행위/안전 위협' },
                  { value: 'ETC', label: '기타' },
                ].map((opt) => (
                  <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${reportType === opt.value ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}>
                    <input type="radio" name="reportType" value={opt.value} checked={reportType === opt.value} onChange={(e) => setReportType(e.target.value)} className="accent-orange-500" />
                    <span className="text-sm font-semibold text-slate-700">{opt.label}</span>
                  </label>
                ))}
              </div>

              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="상세 사유를 입력해주세요 (선택)"
                maxLength={500}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none mb-5 font-pretendard"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleReportSubmit}
                  disabled={reportMutation.isPending}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm shadow-lg shadow-orange-200/50 hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {reportMutation.isPending ? '접수 중...' : '신고 접수'}
                </button>
              </div>
            </motion.div>
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
