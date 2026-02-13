import React, { useContext, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Trash2, X, ImageIcon, ExternalLink } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/main/Footer';
import { useReviewDetail, useDeleteReview } from '../api/useReview';
import { AuthContext } from '../components/AuthContext';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function StarRating({ rating, size = 'w-5 h-5' }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`${size} ${i < rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewDetail() {
  const { reviewNo } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const [lightboxImg, setLightboxImg] = useState(null);

  const { data, isLoading } = useReviewDetail(reviewNo);
  const deleteMutation = useDeleteReview();

  const review = data?.success ? data.data : null;

  const isAuthor = user && review && user.memberNo === review.memberNo;

  const contentImageList = review?.contentImages
    ? review.contentImages.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const r = await deleteMutation.mutateAsync(Number(reviewNo));
      if (r.success) { alert('삭제되었습니다.'); navigate('/reviews'); }
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

  if (!review) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <Header />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-40">
          <div className="w-20 h-20 bg-sky-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <SearchIcon className="w-10 h-10 text-sky-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-3">존재하지 않는 후기입니다</h2>
          <button onClick={() => navigate('/reviews')} className="text-sky-500 hover:text-sky-600 font-semibold">
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
          src={review.imageUrl || DEFAULT_IMAGE}
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
          onClick={() => navigate('/reviews')}
          className="absolute top-6 left-6 w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-xl flex items-center justify-center shadow-lg hover:bg-white hover:shadow-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </motion.button>

        {/* 히어로 하단 정보 */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={review.rating} size="w-6 h-6" />
              <span className="text-white/80 text-sm font-semibold">{review.rating}.0</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
              {review.title}
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
        <div className="absolute top-20 right-0 w-60 h-60 bg-cyan-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-40 left-0 w-48 h-48 bg-sky-100/30 rounded-full blur-3xl -z-10" />

        {/* 작성자 카드 */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 mb-6 border border-sky-50">

          {/* 작성자 */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-sky-50">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-400 via-cyan-400 to-teal-400 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-200/50 overflow-hidden">
              {review.authorProfile ? (
                <img src={review.authorProfile} alt="" className="w-full h-full object-cover" />
              ) : (
                review.authorNickname?.[0] || '?'
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-lg">{review.authorNickname}</p>
              <p className="text-sm text-slate-400">{review.createdAt}</p>
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

          {/* 별점 + 참여 동행 */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="relative bg-gradient-to-br from-sky-50/80 to-cyan-50/50 rounded-2xl p-4 border border-sky-100/50 hover:shadow-lg hover:shadow-sky-100/30 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center mb-3 shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">별점</p>
              <div className="mt-1">
                <StarRating rating={review.rating} />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="relative bg-gradient-to-br from-sky-50/80 to-cyan-50/50 rounded-2xl p-4 border border-sky-100/50 hover:shadow-lg hover:shadow-sky-100/30 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center mb-3 shadow-md">
                <ExternalLink className="w-5 h-5 text-white" />
              </div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">참여 동행</p>
              {review.companionNo && review.companionTitle ? (
                <Link
                  to={`/companions/${review.companionNo}`}
                  className="text-base font-bold text-sky-600 hover:text-sky-700 mt-0.5 line-clamp-1 block transition-colors"
                >
                  {review.companionTitle}
                </Link>
              ) : (
                <p className="text-base font-bold text-slate-700 mt-0.5">없음</p>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* 본문 내용 */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 mb-6 border border-sky-50">
          <h3 className="text-sm font-bold text-sky-500 uppercase tracking-wider mb-4" style={{ fontFamily: "'Pretendard', sans-serif" }}>후기 내용</h3>
          <p className="text-slate-600 leading-[1.9] whitespace-pre-wrap text-[15px]">{review.content}</p>
        </motion.div>

        {/* 본문 이미지 갤러리 */}
        {contentImageList.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
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

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
