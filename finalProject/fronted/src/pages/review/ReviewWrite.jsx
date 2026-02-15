import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, ImagePlus, ArrowLeft, Loader2, Camera, FileText, Star, Sparkles, MessageSquare } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { useCreateReview } from '../../api/review/useReview';
import { AuthContext } from '../../components/AuthContext';
import heroStar from '../../assets/images/comapanion/별.png';
import heroFriends from '../../assets/images/comapanion/친구.png';

const heroSlides = [heroStar, heroFriends];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_CONTENT_IMAGES = 5;

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function StarSelector({ rating, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <svg
            className={`w-8 h-8 transition-colors ${(hover || rating) >= star ? 'text-amber-400' : 'text-slate-200'}`}
            fill="currentColor" viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ReviewWrite() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const createMutation = useCreateReview();

  const [form, setForm] = useState({ title: '', content: '', companionNo: '', rating: 5 });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [contentImages, setContentImages] = useState([]);
  const [contentPreviews, setContentPreviews] = useState([]);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <Header />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-40">
          <div className="w-20 h-20 bg-sky-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <MessageSquare className="w-10 h-10 text-sky-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-3">로그인이 필요합니다</h2>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-200"
          >
            로그인하기
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) { alert(`이미지 파일만 업로드 가능합니다. (${file.name})`); return false; }
    if (file.size > MAX_FILE_SIZE) { alert(`파일 크기는 10MB 이하만 가능합니다. (${file.name})`); return false; }
    return true;
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validateFile(file)) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(null);
  };

  const handleContentImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_CONTENT_IMAGES - contentImages.length;
    if (remaining <= 0) { alert(`본문 이미지는 최대 ${MAX_CONTENT_IMAGES}장까지 가능합니다.`); return; }
    const valid = files.slice(0, remaining).filter(validateFile);
    setContentImages(prev => [...prev, ...valid]);
    setContentPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))]);
  };

  const removeContentImage = (index) => {
    URL.revokeObjectURL(contentPreviews[index]);
    setContentImages(prev => prev.filter((_, i) => i !== index));
    setContentPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { alert('제목과 내용을 입력해주세요.'); return; }
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('rating', form.rating);
    if (form.companionNo) formData.append('companionNo', form.companionNo);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    contentImages.forEach(file => formData.append('contentImages', file));
    try {
      const result = await createMutation.mutateAsync(formData);
      if (result.success) { alert('작성 완료!'); navigate('/reviews'); }
      else alert(result.message || '작성 실패');
    } catch { alert('작성 중 오류가 발생했습니다.'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      {/* 히어로 */}
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/50 text-sm tracking-[0.3em] uppercase mb-5"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            Jeju Review
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-cyan-100 shadow-lg shadow-cyan-500/10"
          >
            <MessageSquare className="w-4 h-4 text-cyan-300" />
            <span style={{ fontFamily: "'Pretendard', sans-serif" }}>동행 후기</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl font-black mb-6 text-center leading-tight drop-shadow-lg"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            <span className="text-white">함께라서 더 특별한 </span>
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">제주</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-white/70 text-center max-w-md leading-relaxed"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            동행러들의 솔직한 여행 후기를 만나보세요.
          </motion.p>
        </div>

        {/* 인디케이터 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${heroSlide === idx ? 'w-10 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>

        {/* 하단 웨이브 */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(240 249 255)" d="M0,50 C300,80 600,20 900,50 C1100,70 1300,30 1440,45 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="relative max-w-5xl mx-auto px-5 py-10">
        <div className="absolute top-20 right-0 w-60 h-60 bg-cyan-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-40 left-0 w-48 h-48 bg-sky-100/30 rounded-full blur-3xl -z-10" />

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/reviews')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-500 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로 돌아가기
        </motion.button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* 폼 영역 - 좌측 3칸 */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            {/* 썸네일 */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 border border-sky-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">썸네일 이미지</h3>
              </div>
              {thumbnailPreview ? (
                <div className="relative w-full h-60 rounded-2xl overflow-hidden group">
                  <img src={thumbnailPreview} alt="썸네일" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-3 right-3 w-9 h-9 bg-red-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-60 rounded-2xl border-2 border-dashed border-sky-200 bg-gradient-to-br from-sky-50/50 to-cyan-50/50 cursor-pointer hover:border-sky-400 hover:from-sky-50 hover:to-cyan-50 transition-all duration-300 group">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                    <Upload className="w-12 h-12 text-sky-300 group-hover:text-sky-400 transition-colors mb-3" />
                  </motion.div>
                  <span className="text-sm font-semibold text-slate-400 group-hover:text-sky-500 transition-colors">클릭하여 썸네일을 업로드하세요</span>
                  <span className="text-xs text-slate-300 mt-1">JPG, PNG (최대 10MB)</span>
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                </label>
              )}
            </motion.div>

            {/* 제목 + 내용 + 별점 */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 border border-sky-50">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">기본 정보</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">제목 <span className="text-sky-500">*</span></label>
                  <input type="text" name="title" value={form.title} onChange={handleChange}
                    maxLength={100}
                    placeholder="예: 우도 자전거 동행 너무 좋았어요!"
                    className="w-full px-4 py-3.5 rounded-xl bg-sky-50/50 border border-sky-100 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm font-medium placeholder-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">별점</label>
                  <StarSelector rating={form.rating} onChange={(r) => setForm(prev => ({ ...prev, rating: r }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">내용 <span className="text-sky-500">*</span></label>
                  <textarea name="content" value={form.content} onChange={handleChange} rows={6}
                    maxLength={4000}
                    placeholder="동행 경험에 대한 솔직한 후기를 작성해주세요&#10;&#10;- 어떤 동행이었나요?&#10;- 가장 좋았던 순간은?&#10;- 추천 포인트"
                    className="w-full px-4 py-3.5 rounded-xl bg-sky-50/50 border border-sky-100 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm font-medium placeholder-slate-300 resize-none leading-relaxed"
                  />
                </div>
              </div>
            </motion.div>

            {/* 참여 동행 번호 (선택) */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 border border-sky-50">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">참여한 동행</h3>
                <span className="text-xs text-slate-400">(선택)</span>
              </div>
              <input type="number" name="companionNo" value={form.companionNo} onChange={handleChange}
                placeholder="참여한 동행 게시글 번호 (선택사항)"
                className="w-full px-4 py-3.5 rounded-xl bg-sky-50/50 border border-sky-100 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm font-medium placeholder-slate-300"
              />
            </motion.div>

            {/* 본문 이미지 */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 border border-sky-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-lg flex items-center justify-center">
                  <ImagePlus className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">본문 이미지</h3>
                <span className="text-sm text-slate-400 ml-1">{contentImages.length}/{MAX_CONTENT_IMAGES}</span>
              </div>

              {contentPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {contentPreviews.map((src, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-2xl overflow-hidden group shadow-md shadow-sky-100/30"
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeContentImage(idx)}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-3.5 h-3.5" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}

              {contentImages.length < MAX_CONTENT_IMAGES && (
                <label className="flex items-center justify-center gap-2 w-full py-5 rounded-2xl border-2 border-dashed border-sky-200 bg-gradient-to-br from-sky-50/30 to-cyan-50/30 cursor-pointer hover:border-sky-400 hover:from-sky-50/60 hover:to-cyan-50/60 transition-all duration-300 group">
                  <ImagePlus className="w-5 h-5 text-sky-300 group-hover:text-sky-400 transition-colors" />
                  <span className="text-sm font-semibold text-slate-400 group-hover:text-sky-500 transition-colors">이미지 추가</span>
                  <input type="file" accept="image/*" multiple onChange={handleContentImagesChange} className="hidden" />
                </label>
              )}
            </motion.div>

            {/* 제출 버튼 */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              <motion.button
                type="submit"
                disabled={createMutation.isPending}
                whileHover={{ scale: 1.01, boxShadow: '0 20px 40px -10px rgba(14, 165, 233, 0.35)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 text-white font-bold text-lg rounded-2xl shadow-lg shadow-sky-200/50 transition-all disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    작성 중...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    후기 작성
                  </span>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* 미리보기 카드 - 우측 2칸 */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="lg:col-span-2"
          >
            <div className="sticky top-8">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 pl-1">미리보기</p>
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-sky-100/40 border border-sky-50">
                {/* 카드 이미지 */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-sky-100 to-cyan-100">
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <Camera className="w-10 h-10 text-sky-300" />
                      <span className="text-xs text-sky-400 font-medium">썸네일 미리보기</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                  <span className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-amber-500 shadow-lg flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {form.rating}
                  </span>
                </div>
                {/* 카드 내용 */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1">
                    {form.title || '제목을 입력하세요'}
                  </h3>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < form.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-sky-200/50">
                      {user?.memberNickname?.[0] || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{user?.memberNickname || '나'}</p>
                      <p className="text-xs text-slate-400">방금 전</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 가이드 팁 */}
              <div className="mt-6 bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 rounded-2xl p-6 border border-sky-100/60 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-lg flex items-center justify-center shadow-md shadow-sky-200/40">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h4 className="text-sm font-extrabold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent tracking-wide" style={{ fontFamily: "'GmarketSans', sans-serif" }}>
                    작성 팁
                  </h4>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-sky-200/50">
                      <span className="text-white text-[10px] font-bold">1</span>
                    </span>
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                      솔직한 <span className="text-sky-500 font-semibold">경험담</span>이 다른 분들에게 도움돼요
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-cyan-200/50">
                      <span className="text-white text-[10px] font-bold">2</span>
                    </span>
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                      여행 <span className="text-cyan-500 font-semibold">사진</span>을 함께 올리면 더 생생해요
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-teal-200/50">
                      <span className="text-white text-[10px] font-bold">3</span>
                    </span>
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                      <span className="text-teal-500 font-semibold">별점</span>으로 만족도를 표현해주세요
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
