import React, { useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Upload, X, Loader2, ArrowLeft, Calendar, Users, FileImage, ShieldCheck } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import { useCreateAccommodationReview } from '../../api/accommodation/useAccommodationReview';
import { AuthContext } from '../../components/AuthContext';
import { compressImage } from '../../lib/imageUtils';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const RECOMMEND_OPTIONS = ['혼행러', '커플', '가족', '친구', '비즈니스'];

export default function AccommodationReviewWrite() {
  const { accommodationNo } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [recommendedFor, setRecommendedFor] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [verificationFile, setVerificationFile] = useState(null);
  const [verificationPreview, setVerificationPreview] = useState(null);
  const verificationInputRef = useRef(null);

  const createMutation = useCreateAccommodationReview(Number(accommodationNo));

  const handleImageAdd = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert('이미지는 최대 5장까지 첨부할 수 있습니다.');
      return;
    }

    const valid = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`이미지 파일만 업로드 가능합니다. (${file.name})`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`파일 크기는 10MB 이하만 가능합니다. (${file.name})`);
        return false;
      }
      return true;
    });

    const compressed = await Promise.all(valid.map(f => compressImage(f, 1024, 0.72)));
    const newImages = [...images, ...compressed].slice(0, 5);
    const newPreviews = newImages.map(f => URL.createObjectURL(f));

    setImages(newImages);
    setPreviews(newPreviews);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleVerificationFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기는 10MB 이하만 가능합니다.');
      return;
    }
    setVerificationFile(file);
    setVerificationPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('후기 내용을 입력해주세요.');
      return;
    }

    if (!verificationFile) {
      alert('인증서류(예약 확인서)를 첨부해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('content', content);
    if (checkInDate) formData.append('checkInDate', checkInDate);
    if (checkOutDate) formData.append('checkOutDate', checkOutDate);
    if (recommendedFor) formData.append('recommendedFor', recommendedFor);
    images.forEach(img => formData.append('images', img));
    formData.append('verificationFile', verificationFile);

    createMutation.mutate(formData, {
      onSuccess: (res) => {
        if (res.success) {
          alert('후기가 등록되었습니다. 관리자 승인 후 공개됩니다.');
          navigate(`/accommodations/${accommodationNo}`);
        } else {
          alert(res.message || '후기 등록에 실패했습니다.');
        }
      },
      onError: () => {
        alert('후기 등록 중 오류가 발생했습니다.');
      },
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
        <Header />
        <div className="max-w-2xl mx-auto px-5 py-20 text-center">
          <p className="text-slate-500">로그인이 필요합니다.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      <div className="max-w-2xl mx-auto px-5 py-10">
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </button>

        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <h1
            className="text-2xl font-black text-slate-800 mb-8"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            숙소 후기 작성
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 별점 */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">별점</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-lg font-bold text-slate-700">{rating}.0</span>
              </div>
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">후기 내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="숙소에 대한 솔직한 후기를 남겨주세요..."
                rows={6}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent resize-none"
                maxLength={2000}
              />
              <p className="text-right text-xs text-slate-400 mt-1">{content.length}/2000</p>
            </div>

            {/* 체크인/체크아웃 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  체크인
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  체크아웃
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                />
              </div>
            </div>

            {/* 추천 대상 */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                추천 대상
              </label>
              <div className="flex flex-wrap gap-2">
                {RECOMMEND_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRecommendedFor(recommendedFor === opt ? '' : opt)}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                      recommendedFor === opt
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-500 hover:bg-sky-50 hover:text-sky-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 이미지 업로드 */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                이미지 첨부 <span className="font-normal text-slate-400">(최대 5장)</span>
              </label>
              <div className="flex gap-3 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-200 hover:border-sky-300 flex flex-col items-center justify-center text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    <FileImage className="w-5 h-5" />
                    <span className="text-[10px] mt-1">추가</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageAdd}
                className="hidden"
              />
            </div>

            {/* 인증서류 (예약 확인서) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                인증서류 (예약 확인서) <span className="text-red-400">*</span>
              </label>
              <p className="text-xs text-slate-400 mb-3">숙박 예약확인서, 영수증 등 실제 이용을 증명할 수 있는 서류를 첨부해주세요.</p>
              <div
                onClick={() => verificationInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-emerald-300 rounded-xl p-5 text-center cursor-pointer transition-colors"
              >
                {verificationPreview ? (
                  <div className="relative inline-block">
                    <img src={verificationPreview} alt="인증서류 미리보기" className="max-h-40 mx-auto rounded-lg" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVerificationFile(null);
                        setVerificationPreview(null);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm text-slate-500">클릭하여 인증서류 이미지를 선택하세요</p>
                    <p className="text-xs text-slate-400">JPG, PNG (최대 10MB)</p>
                  </div>
                )}
              </div>
              <input
                ref={verificationInputRef}
                type="file"
                accept="image/*"
                onChange={handleVerificationFileChange}
                className="hidden"
              />
            </div>

            {/* 제출 */}
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> 등록 중...</>
              ) : (
                <><Upload className="w-4 h-4" /> 후기 등록</>
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
