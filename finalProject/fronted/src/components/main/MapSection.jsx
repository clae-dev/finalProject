import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useActiveSpots } from '../../api/spot/useSpot';
import KakaoMap from '../common/KakaoMap';

// 제주 주요 명소 기본 좌표
const DEFAULT_SPOT_MARKERS = [
  { lat: 33.5597, lng: 126.9331, name: '성산일출봉', info: '🌅 일출 명소' },
  { lat: 33.4474, lng: 126.3233, name: '협재해수욕장', info: '🏖 해변' },
  { lat: 33.5437, lng: 126.8697, name: '우도', info: '🚲 섬 속의 섬' },
  { lat: 33.3617, lng: 126.5292, name: '한라산 백록담', info: '🏔 제주 최고봉' },
  { lat: 33.4500, lng: 126.9275, name: '월정리 해변', info: '💙 에메랄드 바다' },
  { lat: 33.2459, lng: 126.5125, name: '중문관광단지', info: '🏨 관광단지' },
  { lat: 33.5135, lng: 126.5150, name: '제주시 구도심', info: '🏙 시내 중심' },
  { lat: 33.2523, lng: 126.5603, name: '서귀포시', info: '🌊 남쪽 해안' },
];

export default function MapSection() {
  const { data } = useActiveSpots();
  const [selectedMarker, setSelectedMarker] = useState(null);

  // API 데이터에 좌표가 있으면 사용, 없으면 기본값
  const rawSpots = (data?.success && data.data?.length > 0) ? data.data : [];
  const spotMarkers = rawSpots
    .filter(s => s.spotLat && s.spotLng)
    .map(s => ({ lat: s.spotLat, lng: s.spotLng, name: s.spotTitle, info: s.spotTag }));

  const markers = spotMarkers.length > 0 ? spotMarkers : DEFAULT_SPOT_MARKERS;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-50 rounded-full text-sm font-bold text-sky-600 mb-5 border border-sky-100"
          >
            <MapPin className="w-4 h-4" />
            <span className="font-gmarket">JEJU MAP</span>
          </motion.span>
          <h2
            className="text-3xl md:text-4xl font-black text-slate-800 mb-3 font-gmarket"
          >
            제주 명소 <span className="bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">지도</span>
          </h2>
          <p className="text-slate-400 text-base font-pretendard">
            혼행러들이 사랑한 제주 명소를 지도에서 찾아보세요
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl shadow-sky-100/30 border border-sky-50 overflow-hidden"
        >
          <div className="p-4 md:p-6">
            <KakaoMap
              lat={33.3617}
              lng={126.5292}
              level={10}
              markers={markers}
              height="420px"
              onMarkerClick={(marker) => setSelectedMarker(marker)}
            />
          </div>

          {/* 선택된 마커 정보 */}
          {selectedMarker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-4 mb-4 md:mx-6 md:mb-6 p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 font-pretendard">
                    {selectedMarker.name}
                  </p>
                  {selectedMarker.info && (
                    <p className="text-sm text-slate-500">{selectedMarker.info}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </motion.div>
          )}

          {/* 명소 태그 목록 */}
          <div className="px-4 pb-4 md:px-6 md:pb-6">
            <div className="flex flex-wrap gap-2">
              {markers.slice(0, 8).map((m, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-sky-50 rounded-full text-xs font-semibold text-slate-600 hover:text-sky-600 cursor-pointer border border-slate-100 hover:border-sky-200 transition-all font-pretendard"
                  onClick={() => setSelectedMarker(m)}
                >
                  <MapPin className="w-3 h-3" />
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
