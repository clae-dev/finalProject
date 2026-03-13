import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, ImagePlus, ArrowLeft, Loader2, FileText, Sparkles, CalendarDays } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { useCreateActivity, useUpdateActivity, useActivityDetail } from '../../api/activity/useActivity';
import { AuthContext } from '../../components/AuthContext';
import { compressImage } from '../../lib/imageUtils';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGES = 5;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function ActivityWrite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editBoardNo = searchParams.get('edit');
  const isEdit = !!editBoardNo;

  const { user } = useContext(AuthContext) || {};
  const createMutation = useCreateActivity();
  const updateMutation = useUpdateActivity();

  const { data: editData } = useActivityDetail(isEdit ? editBoardNo : null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // 수정 모드: 기존 데이터 로드
  useEffect(() => {
    if (isEdit && editData?.success && !loaded) {
      const board = editData.data;
      setTitle(board.boardTitle || '');
      setContent(board.boardContent || '');
      if (board.imageList && board.imageList.length > 0) {
        setPreviews(board.imageList);
      }
      setLoaded(true);
    }
  }, [isEdit, editData, loaded]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-40">
          <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <CalendarDays className="w-10 h-10 text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-3">로그인이 필요합니다</h2>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200"
          >
            로그인하기
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) { alert(`이미지 파일만 업로드 가능합니다. (${file.name})`); return false; }
    if (file.size > MAX_FILE_SIZE) { alert(`파일 크기는 10MB 이하만 가능합니다. (${file.name})`); return false; }
    return true;
  };

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) { alert(`이미지는 최대 ${MAX_IMAGES}장까지 가능합니다.`); return; }
    const valid = files.slice(0, remaining).filter(validateFile);
    const compressed = await Promise.all(valid.map(f => compressImage(f, 1024, 0.72)));
    setImages(prev => [...prev, ...compressed]);
    setPreviews(prev => [...prev, ...compressed.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    if (previews[index] && previews[index].startsWith('blob:')) {
      URL.revokeObjectURL(previews[index]);
    }
    const fileIndex = index - (previews.length - images.length);
    if (fileIndex >= 0) {
      setImages(prev => prev.filter((_, i) => i !== fileIndex));
    }
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) { alert('제목과 내용을 입력해주세요.'); return; }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    images.forEach(file => formData.append('images', file));

    try {
      if (isEdit) {
        const result = await updateMutation.mutateAsync({ boardNo: Number(editBoardNo), formData });
        if (result.success) { alert('수정 완료!'); navigate(`/activities/${editBoardNo}`); }
        else alert(result.message || '수정 실패');
      } else {
        const result = await createMutation.mutateAsync(formData);
        if (result.success) { alert('작성 완료!'); navigate('/activities'); }
        else alert(result.message || '작성 실패');
      }
    } catch { alert('처리 중 오류가 발생했습니다.'); }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50">
      <Header />

      {/* 히어로 */}
      <div className="relative h-[320px] overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500">
        <motion.div
          className="absolute top-10 left-[10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-10 right-[10%] w-48 h-48 bg-amber-300/10 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-orange-100 shadow-lg"
          >
            <CalendarDays className="w-4 h-4 text-orange-300" />
            <span style={{ fontFamily: "'Pretendard', sans-serif" }}>{isEdit ? 'Edit Event' : 'New Event'}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl md:text-5xl font-black mb-4 text-center leading-tight drop-shadow-lg"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            <span className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 bg-clip-text text-transparent">
              {isEdit ? '행사 수정' : '행사 등록'}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-white/70 text-center"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            {isEdit ? '행사 정보를 수정합니다' : '제주의 멋진 행사와 액티비티를 공유해보세요'}
          </motion.p>
        </div>

        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path fill="rgb(255 251 235)" d="M0,50 C300,80 600,20 900,50 C1100,70 1300,30 1440,45 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="relative max-w-3xl mx-auto px-5 py-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(isEdit ? `/activities/${editBoardNo}` : '/activities')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-500 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {isEdit ? '상세로 돌아가기' : '목록으로 돌아가기'}
        </motion.button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 + 내용 */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="bg-white rounded-3xl shadow-xl shadow-orange-100/40 p-7 border border-orange-50">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-slate-800">행사 정보</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">제목 <span className="text-orange-500">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  placeholder="행사/액티비티 제목을 입력하세요"
                  className="w-full px-4 py-3.5 rounded-xl bg-orange-50/50 border border-orange-100 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm font-medium placeholder-slate-300"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                />
                <p className="text-right text-xs text-slate-400 mt-1">{title.length}/100</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">내용 <span className="text-orange-500">*</span></label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  maxLength={4000}
                  placeholder="행사 일시, 장소, 내용 등을 자유롭게 작성해주세요"
                  className="w-full px-4 py-3.5 rounded-xl bg-orange-50/50 border border-orange-100 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm font-medium placeholder-slate-300 resize-none leading-relaxed"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}
                />
                <p className="text-right text-xs text-slate-400 mt-1">{content.length}/4000</p>
              </div>
            </div>
          </motion.div>

          {/* 이미지 업로드 */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="bg-white rounded-3xl shadow-xl shadow-orange-100/40 p-7 border border-orange-50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-lg flex items-center justify-center">
                <ImagePlus className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-slate-800">이미지</h3>
              <span className="text-sm text-slate-400 ml-1">{previews.length}/{MAX_IMAGES}</span>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {previews.map((src, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-2xl overflow-hidden group shadow-md shadow-orange-100/30"
                  >
                    <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}

            {previews.length < MAX_IMAGES && (
              <label className="flex flex-col items-center justify-center w-full py-8 rounded-2xl border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/50 to-amber-50/50 cursor-pointer hover:border-orange-400 hover:from-orange-50 hover:to-amber-50 transition-all duration-300 group">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <Upload className="w-10 h-10 text-orange-300 group-hover:text-orange-400 transition-colors mb-3" />
                </motion.div>
                <span className="text-sm font-semibold text-slate-400 group-hover:text-orange-500 transition-colors">클릭하여 이미지를 업로드하세요</span>
                <span className="text-xs text-slate-300 mt-1">JPG, PNG (최대 10MB, {MAX_IMAGES}장)</span>
                <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
              </label>
            )}
          </motion.div>

          {/* 제출 버튼 */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="flex gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(isEdit ? `/activities/${editBoardNo}` : '/activities')}
              className="flex-1 py-5 bg-white text-slate-500 font-bold text-lg rounded-2xl shadow-md border border-slate-200 hover:bg-slate-50 transition-all"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              취소
            </motion.button>
            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={{ scale: 1.01, boxShadow: '0 20px 40px -10px rgba(249, 115, 22, 0.35)' }}
              whileTap={{ scale: 0.98 }}
              className="flex-[2] py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-white font-bold text-lg rounded-2xl shadow-lg shadow-orange-200/50 transition-all disabled:opacity-50"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isEdit ? '수정 중...' : '등록 중...'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {isEdit ? '수정 완료' : '행사 등록'}
                </span>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
