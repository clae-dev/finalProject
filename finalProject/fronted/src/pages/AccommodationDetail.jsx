import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { getAccommodationDetail } from '../api/accommodationAPI';
import { Button } from '@/components/ui/button';
import { Star, Heart, MapPin, Clock, Wifi, Car, Coffee, Waves, ChevronLeft, ChevronRight, Phone, Share2, Loader2, AlertCircle } from 'lucide-react';

export default function AccommodationDetail() {
  const { accommodationNo } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [accommodationNo]);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAccommodationDetail(accommodationNo);
      if (response.success) {
        setAccommodation(response.data);
      } else {
        setError(response.message || '숙소 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('숙소 상세 조회 실패:', err);
      setError('서버와 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const defaultImage = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800';

  const formatPrice = (priceMin, priceMax) => {
    if (!priceMin && !priceMax) return '가격 문의';
    if (priceMin) return priceMin.toLocaleString();
    return priceMax.toLocaleString();
  };

  const parseFacilities = (facilities) => {
    if (!facilities) return [];
    return facilities.split(',').map(f => f.trim()).filter(f => f);
  };

  const facilityIconMap = {
    '와이파이': Wifi, 'wifi': Wifi, 'Wi-Fi': Wifi, 'WIFI': Wifi,
    '주차': Car, '주차장': Car, '무료주차': Car,
    '조식': Coffee, '카페': Coffee, '커피': Coffee,
    '오션뷰': Waves, '바다': Waves, '수영장': Waves, '풀': Waves,
  };

  const getFacilityIcon = (facility) => {
    for (const [key, Icon] of Object.entries(facilityIconMap)) {
      if (facility.includes(key)) return Icon;
    }
    return Wifi;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-cyan-100 to-blue-100">
        <Header />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          <span className="ml-3 text-slate-500">숙소 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error || !accommodation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-cyan-100 to-blue-100">
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <AlertCircle className="w-12 h-12 text-rose-400 mb-4" />
          <p className="text-rose-500 text-lg mb-4">{error || '숙소를 찾을 수 없습니다.'}</p>
          <Button onClick={() => navigate('/accommodations')} variant="outline">
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const images = [accommodation.thumbnailUrl || defaultImage];
  const facilities = parseFacilities(accommodation.facilities);
  const amenities = facilities.map(f => ({ icon: getFacilityIcon(f), label: f }));

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-cyan-100 to-blue-100">
      <Header />

      <div className="pt-16 max-w-6xl mx-auto px-5 py-8">
        {/* 이미지 갤러리 */}
        <div className="mb-8">
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={images[currentImageIndex]}
              alt={accommodation.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = defaultImage; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />

            {/* 이미지 네비게이션 */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-slate-700" />
                </button>
              </>
            )}

            {/* 이미지 인디케이터 */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 썸네일 이미지 */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex ? 'border-sky-400 shadow-lg' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`썸네일 ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 왼쪽: 숙소 정보 */}
          <div className="md:col-span-2 space-y-8">
            {/* 기본 정보 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {accommodation.accommodationType && (
                      <span className="px-3 py-1 bg-sky-100 text-sky-600 text-xs font-semibold rounded-full">
                        {accommodation.accommodationType}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-cyan-100 text-cyan-600 text-xs font-semibold rounded-full">
                      혼행추천
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{accommodation.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">4.5</span>
                      <span>({accommodation.viewCount || 0})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{accommodation.region}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                </button>
              </div>

              <p className="text-slate-600 leading-relaxed">
                {accommodation.recommendationReason || `${accommodation.region}에 위치한 ${accommodation.accommodationType || '숙소'}입니다. ${accommodation.address}`}
              </p>
            </div>

            {/* 숙소 제공 시설 */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-sky-400 to-cyan-400 rounded-full" />
                  숙소 제공 시설
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <amenity.icon className="w-5 h-5 text-sky-500" />
                      <span className="text-sm font-medium text-slate-700">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 후기 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-sky-400 to-cyan-400 rounded-full" />
                  숙소 후기
                </h2>
                <Button className="bg-sky-500 hover:bg-sky-600">
                  후기 작성하기
                </Button>
              </div>

              <div className="text-center py-8 text-slate-400">
                <Star className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="text-sm">아직 작성된 후기가 없습니다.</p>
                <p className="text-xs mt-1">첫 번째 후기를 작성해보세요!</p>
              </div>
            </div>
          </div>

          {/* 오른쪽: 예약 정보 */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                <div className="mb-6">
                  <div className="text-3xl font-bold text-slate-800 mb-1">
                    ₩{formatPrice(accommodation.priceMin, accommodation.priceMax)}
                    <span className="text-base font-normal text-slate-500">/박</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-600">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">4.5</span>
                    <span>· 조회 {accommodation.viewCount || 0}회</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="font-medium text-slate-700">위치</div>
                      <div className="text-slate-500">{accommodation.address}</div>
                    </div>
                  </div>

                  {accommodation.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="font-medium text-slate-700">연락처</div>
                        <div className="text-slate-500">{accommodation.phone}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="font-medium text-slate-700">체크인/아웃</div>
                      <div className="text-slate-500">{accommodation.checkInTime || '15:00'} / {accommodation.checkOutTime || '11:00'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full h-12 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold text-base shadow-lg">
                    지금 예약 문의하기
                  </Button>

                  <button className="w-full h-12 border-2 border-slate-200 hover:border-slate-300 rounded-lg font-semibold text-slate-700 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    공유하기
                  </button>
                </div>

                <div className="mt-6 p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                  <div className="text-xs text-cyan-600 font-semibold mb-1">혼행 TIP</div>
                  <div className="text-sm text-cyan-800">
                    {accommodation.recommendationReason || '혼자 여행하기 좋은 숙소입니다!'}
                  </div>
                </div>
              </div>

              {/* 위치 지도 */}
              <div className="mt-4 bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">위치</h3>
                <div className="h-48 bg-gradient-to-br from-cyan-100 to-sky-100 rounded-xl flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-sky-500" />
                    <div className="text-sm">지도가 표시됩니다</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-600">
                  {accommodation.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
