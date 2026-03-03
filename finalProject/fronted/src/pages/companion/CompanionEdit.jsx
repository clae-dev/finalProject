import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ImagePlus, ArrowLeft, Loader2, FileText, Tag, CalendarDays, Users, Sparkles, MapPin, Search } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/main/Footer';
import KakaoMap from '../../components/common/KakaoMap';
import { useCompanionDetail, useUpdateCompanion } from '../../api/companion/useCompanion';
import { AuthContext } from '../../components/AuthContext';
import heroStar from '../../assets/images/companion/별.webp';
import heroFriends from '../../assets/images/companion/친구.webp';
import { compressImage } from '../../lib/imageUtils';
import { getDday, formatTravelDate } from '../../lib/companionUtils';

const heroSlides = [heroStar, heroFriends];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_CONTENT_IMAGES = 5;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function CompanionEdit() {
  const { companionNo } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  const { data, isLoading } = useCompanionDetail(companionNo);
  const updateMutation = useUpdateCompanion(companionNo);

  const [form, setForm] = useState({ title: '', content: '', travelDate: '', maxMembers: 4, tags: '' });
  const [heroSlide, setHeroSlide] = useState(0);

  // 기존 이미지 URL 목록 (X 버튼으로 제거 가능)
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  // 새로 추가한 이미지
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // 장소 검색 state
  const [placeQuery, setPlaceQuery] = useState('');
  const [placeResults, setPlaceResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searching, setSearching] = useState(false);
  const psRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  // 기존 데이터 pre-fill (최초 1회)
  useEffect(() => {
    if (!initialized && data?.success && data.data) {
      const c = data.data;
      // travelDate: YYYY-MM-DD 형식으로 변환
      let travelDate = '';
      if (c.travelDate) {
        const isoMatch = c.travelDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) travelDate = `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
        else travelDate = c.travelDate;
      }
      setForm({
        title: c.title || '',
        content: c.content || '',
        travelDate,
        maxMembers: c.maxMembers || 4,
        tags: c.tags || '',
      });
      if (c.contentImages) {
        setExistingImageUrls(c.contentImages.split(',').map(s => s.trim()).filter(Boolean));
      }
      if (c.latitude && c.longitude) {
        setSelectedPlace({ lat: c.latitude, lng: c.longitude, name: c.placeName || '' });
        setPlaceQuery(c.placeName || '');
      }
      setInitialized(true);
    }
  }, [data, initialized]);

  // 카카오 장소 검색 서비스 초기화
  const getPlacesService = useCallback(() => {
    return new Promise((resolve) => {
      if (psRef.current) { resolve(psRef.current); return; }
      if (window.kakao?.maps?.services?.Places) {
        psRef.current = new window.kakao.maps.services.Places();
        resolve(psRef.current); return;
      }
      if (window.kakao?.maps?.load) {
        window.kakao.maps.load(() => {
          if (window.kakao.maps.services?.Places) {
            psRef.current = new window.kakao.maps.services.Places();
          }
          resolve(psRef.current);
        }); return;
      }
      let tries = 0;
      const timer = setInterval(() => {
        tries++;
        if (window.kakao?.maps?.services?.Places) {
          clearInterval(timer);
          psRef.current = new window.kakao.maps.services.Places();
          resolve(psRef.current);
        } else if (tries >= 20) { clearInterval(timer); resolve(null); }
      }, 200);
    });
  }, []);

  const handlePlaceSearch = useCallback(async () => {
    const query = placeQuery.trim();
    if (!query) return;
    setSearching(true);
    const ps = await getPlacesService();
    if (!ps) { setSearching(false); alert('카카오맵 서비스를 불러올 수 없습니다.'); return; }
    ps.keywordSearch(query, (data, status) => {
      setSearching(false);
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaceResults(data.slice(0, 5).map(p => ({
          name: p.place_name, address: p.address_name,
          lat: parseFloat(p.y), lng: parseFloat(p.x),
        })));
      } else { setPlaceResults([]); }
    }, {
      bounds: new window.kakao.maps.LatLngBounds(
        new window.kakao.maps.LatLng(32.8, 125.8),
        new window.kakao.maps.LatLng(34.0, 127.4)
      ),
    });
  }, [placeQuery, getPlacesService]);

  const handlePlaceSelect = (place) => {
    setSelectedPlace({ lat: place.lat, lng: place.lng, name: place.name });
    setPlaceResults([]);
    setPlaceQuery(place.name);
  };

  const removePlace = () => { setSelectedPlace(null); setPlaceQuery(''); setPlaceResults([]); };

  const companion = data?.success ? data.data : null;
  const isAuthor = user && companion && Number(user.memberNo) === Number(companion.memberNo);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <Header />
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
      </div>
    );
  }

  if (!user || (companion && !isAuthor)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <Header />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-40">
          <h2 className="text-xl font-bold text-slate-700 mb-3">수정 권한이 없습니다</h2>
          <button onClick={() => navigate(`/companions/${companionNo}`)} className="text-sky-500 hover:text-sky-600 font-semibold">
            게시글로 돌아가기
          </button>
        </motion.div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) { alert(`이미지 파일만 업로드 가능합니다.`); return false; }
    if (file.size > MAX_FILE_SIZE) { alert(`파일 크기는 10MB 이하만 가능합니다.`); return false; }
    return true;
  };

  const totalImageCount = existingImageUrls.length + newImageFiles.length;

  const handleNewImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_CONTENT_IMAGES - totalImageCount;
    if (remaining <= 0) { alert(`이미지는 최대 ${MAX_CONTENT_IMAGES}장까지 가능합니다.`); return; }
    const valid = files.slice(0, remaining).filter(validateFile);
    const compressed = await Promise.all(valid.map(f => compressImage(f, 1024, 0.72)));
    setNewImageFiles(prev => [...prev, ...compressed]);
    setNewImagePreviews(prev => [...prev, ...compressed.map(f => URL.createObjectURL(f))]);
  };

  const removeExistingImage = (index) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { alert('제목과 내용을 입력해주세요.'); return; }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    if (form.travelDate) formData.append('travelDate', form.travelDate);
    formData.append('maxMembers', form.maxMembers);
    if (form.tags) formData.append('tags', form.tags);
    if (selectedPlace) {
      formData.append('latitude', selectedPlace.lat);
      formData.append('longitude', selectedPlace.lng);
      formData.append('placeName', selectedPlace.name);
    }
    // 유지할 기존 이미지 URL
    if (existingImageUrls.length > 0) {
      formData.append('keepImages', existingImageUrls.join(','));
    }
    // 새 이미지 파일
    newImageFiles.forEach(file => formData.append('newImages', file));

    try {
      const result = await updateMutation.mutateAsync(formData);
      if (result.success) {
        alert('수정 완료!');
        navigate(`/companions/${companionNo}`);
      } else {
        alert(result.message || '수정 실패');
      }
    } catch {
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const tagList = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <Header />

      {/* 히어로 */}
      <div className="relative h-[480px] overflow-hidden">
        {heroSlides.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-[1500ms] ${heroSlide === idx ? 'opacity-100' : 'opacity-0'}`}>
            <motion.img src={img} alt="" className="w-full h-full object-cover"
              animate={{ scale: heroSlide === idx ? 1.05 : 1 }}
              transition={{ duration: 8, ease: 'linear' }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-cyan-900/20 to-slate-900/70" />
        <motion.div className="absolute top-20 left-[10%] w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute bottom-20 right-[10%] w-40 h-40 bg-sky-400/20 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative h-full flex flex-col items-center justify-center text-white px-5">
          <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/50 text-sm tracking-[0.3em] uppercase mb-5"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >Jeju Companion</motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold mb-6 border border-white/20 text-cyan-100 shadow-lg shadow-cyan-500/10"
          >
            <Users className="w-4 h-4 text-cyan-300" />
            <span style={{ fontFamily: "'Pretendard', sans-serif" }}>동행 모집글 수정</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl font-black mb-6 text-center leading-tight drop-shadow-lg"
            style={{ fontFamily: "'GmarketSans', sans-serif" }}
          >
            <span className="text-white">함께라서 더 특별한 </span>
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 bg-clip-text text-transparent">제주</span>
          </motion.h1>
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

      {/* 콘텐츠 */}
      <div className="relative max-w-5xl mx-auto px-5 py-10">
        <div className="absolute top-20 right-0 w-60 h-60 bg-cyan-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-40 left-0 w-48 h-48 bg-sky-100/30 rounded-full blur-3xl -z-10" />

        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(`/companions/${companionNo}`)}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-500 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          게시글로 돌아가기
        </motion.button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* 폼 — 좌측 3칸 */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">

            {/* 장소 검색 */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 border border-sky-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">여행 장소</h3>
              </div>
              <div className="relative mb-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={placeQuery}
                      onChange={(e) => setPlaceQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handlePlaceSearch(); } }}
                      placeholder="장소를 검색하세요 (예: 성산일출봉, 우도)"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-sky-50/50 border border-sky-100 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm font-medium placeholder-slate-300"
                    />
                  </div>
                  <motion.button type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handlePlaceSearch} disabled={searching}
                    className="px-5 py-3.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-xl text-sm shadow-md shadow-sky-200/50 disabled:opacity-50"
                  >
                    {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : '검색'}
                  </motion.button>
                </div>
              </div>
              {placeResults.length > 0 && !selectedPlace && (
                <div className="bg-sky-50/50 rounded-xl border border-sky-100 overflow-hidden mb-3">
                  {placeResults.map((place, idx) => (
                    <button key={idx} type="button" onClick={() => handlePlaceSelect(place)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-sky-100/60 transition-colors text-left border-b border-sky-100/60 last:border-b-0"
                    >
                      <MapPin className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{place.name}</p>
                        <p className="text-xs text-slate-400">{place.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {selectedPlace ? (
                <div>
                  <div className="rounded-2xl overflow-hidden">
                    <KakaoMap lat={selectedPlace.lat} lng={selectedPlace.lng} level={4} name={selectedPlace.name} height="200px" />
                  </div>
                  <button type="button" onClick={removePlace}
                    className="mt-2 text-xs text-slate-400 hover:text-red-400 transition-colors"
                  >장소 초기화</button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed border-sky-200 bg-gradient-to-br from-sky-50/50 to-cyan-50/50">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                    <MapPin className="w-12 h-12 text-sky-300 mb-3" />
                  </motion.div>
                  <span className="text-sm font-semibold text-slate-400">장소를 검색하여 선택하세요</span>
                </div>
              )}
            </motion.div>

            {/* 제목 + 내용 */}
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
                  <input type="text" name="title" value={form.title} onChange={handleChange} maxLength={100}
                    placeholder="예: 2/15 우도 같이 자전거 타실 분!"
                    className="w-full px-4 py-3.5 rounded-xl bg-sky-50/50 border border-sky-100 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm font-medium placeholder-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">내용 <span className="text-sky-500">*</span></label>
                  <textarea name="content" value={form.content} onChange={handleChange} rows={6} maxLength={4000}
                    placeholder="동행에 대한 상세 내용을 작성해주세요"
                    className="w-full px-4 py-3.5 rounded-xl bg-sky-50/50 border border-sky-100 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm font-medium placeholder-slate-300 resize-none leading-relaxed"
                  />
                </div>
              </div>
            </motion.div>

            {/* 여행 정보 */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 border border-sky-50">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">여행 정보</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">여행 일자</label>
                  <input type="date" name="travelDate" value={form.travelDate} onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-sky-50/50 border border-sky-100 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">최대 인원</label>
                  <select name="maxMembers" value={form.maxMembers} onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-sky-50/50 border border-sky-100 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm font-medium"
                  >
                    {[2, 3, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n}명</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mb-2">
                  <Tag className="w-3.5 h-3.5" />태그
                </label>
                <input type="text" name="tags" value={form.tags} onChange={handleChange}
                  placeholder="쉼표로 구분 (예: 우도, 자전거, 일출)"
                  className="w-full px-4 py-3.5 rounded-xl bg-sky-50/50 border border-sky-100 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm font-medium placeholder-slate-300"
                />
                {tagList.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tagList.map((tag, i) => (
                      <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        className="px-3 py-1 bg-gradient-to-r from-sky-50 to-cyan-50 text-sky-600 rounded-full text-xs font-semibold border border-sky-100"
                      >#{tag}</motion.span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* 이미지 관리 */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="bg-white rounded-3xl shadow-xl shadow-sky-100/40 p-7 border border-sky-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-lg flex items-center justify-center">
                  <ImagePlus className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">본문 이미지</h3>
                <span className="text-sm text-slate-400 ml-1">{totalImageCount}/{MAX_CONTENT_IMAGES}</span>
              </div>

              {/* 기존 이미지 */}
              {existingImageUrls.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-slate-400 font-medium mb-2">기존 이미지</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {existingImageUrls.map((url, idx) => (
                      <motion.div key={url} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-square rounded-2xl overflow-hidden group shadow-md shadow-sky-100/30"
                      >
                        <img src={url} alt="" loading="lazy" className="w-full h-full object-cover"
                          onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          type="button" onClick={() => removeExistingImage(idx)}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-3.5 h-3.5" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* 새 이미지 */}
              {newImagePreviews.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-slate-400 font-medium mb-2">새로 추가</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {newImagePreviews.map((src, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-square rounded-2xl overflow-hidden group shadow-md shadow-sky-100/30"
                      >
                        <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          type="button" onClick={() => removeNewImage(idx)}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-3.5 h-3.5" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {totalImageCount < MAX_CONTENT_IMAGES && (
                <label className="flex items-center justify-center gap-2 w-full py-5 rounded-2xl border-2 border-dashed border-sky-200 bg-gradient-to-br from-sky-50/30 to-cyan-50/30 cursor-pointer hover:border-sky-400 hover:from-sky-50/60 hover:to-cyan-50/60 transition-all duration-300 group">
                  <ImagePlus className="w-5 h-5 text-sky-300 group-hover:text-sky-400 transition-colors" />
                  <span className="text-sm font-semibold text-slate-400 group-hover:text-sky-500 transition-colors">이미지 추가</span>
                  <input type="file" accept="image/*" multiple onChange={handleNewImagesChange} className="hidden" />
                </label>
              )}
            </motion.div>

            {/* 제출 버튼 */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              <motion.button type="submit" disabled={updateMutation.isPending}
                whileHover={{ scale: 1.01, boxShadow: '0 20px 40px -10px rgba(14, 165, 233, 0.35)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 text-white font-bold text-lg rounded-2xl shadow-lg shadow-sky-200/50 transition-all disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />수정 중...</span>
                ) : (
                  <span className="inline-flex items-center gap-2"><Sparkles className="w-5 h-5" />수정 완료</span>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* 미리보기 — 우측 2칸 */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="lg:col-span-2">
            <div className="sticky top-8">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 pl-1">미리보기</p>
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-sky-100/40 border border-sky-50">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-sky-100 to-cyan-100">
                  {selectedPlace ? (
                    <KakaoMap lat={selectedPlace.lat} lng={selectedPlace.lng} level={5} name={selectedPlace.name} height="192px" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <MapPin className="w-10 h-10 text-sky-300" />
                      <span className="text-xs text-sky-400 font-medium">장소 미리보기</span>
                    </div>
                  )}
                  {form.travelDate && (() => {
                    const d = getDday(form.travelDate);
                    return d ? (
                      <span className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-sky-500 shadow-lg z-10">{d}</span>
                    ) : null;
                  })()}
                  <div className="absolute bottom-4 left-4 flex gap-2 z-10">
                    {tagList.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-600 shadow-sm">#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-800 text-lg mb-4 line-clamp-1">{form.title || '제목을 입력하세요'}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md overflow-hidden">
                        {user?.memberProfileImg ? (
                          <img src={user.memberProfileImg} alt="" loading="lazy" className="w-full h-full object-cover" />
                        ) : (user?.memberNickname?.[0] || '?')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{user?.memberNickname || '나'}</p>
                        <p className="text-xs text-slate-400">방금 전</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">
                        {companion?.currentMembers ?? 0}/{form.maxMembers}
                      </p>
                      <p className="text-xs text-slate-400">{formatTravelDate(form.travelDate) || '미정'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
