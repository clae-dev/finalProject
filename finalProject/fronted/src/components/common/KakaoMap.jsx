import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Navigation } from 'lucide-react';

/**
 * KakaoMap – 카카오 지도 공통 컴포넌트
 * Props:
 *   lat: number      – 위도
 *   lng: number      – 경도
 *   level: number    – 줌 레벨 (기본 3)
 *   name: string     – 마커에 표시할 이름
 *   markers: Array   – 다중 마커 [{ lat, lng, name, info? }]
 *   height: string   – 지도 높이 CSS (기본 '220px')
 *   onMarkerClick: (marker) => void – 마커 클릭 콜백
 */
export default function KakaoMap({
  lat,
  lng,
  level = 3,
  name = '',
  markers = [],
  height = '220px',
  onMarkerClick,
}) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const onMarkerClickRef = useRef(onMarkerClick);

  // 콜백을 ref로 보관 → 변경돼도 useEffect 재실행 없음
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  useEffect(() => {
    if (!mapRef.current) return;

    const hasCoords = lat && lng;
    const hasMarkers = markers && markers.length > 0;
    if (!hasCoords && !hasMarkers) return;

    const initMap = () => {
      try {
        const centerLat = lat || (hasMarkers ? markers[0].lat : 33.36);
        const centerLng = lng || (hasMarkers ? markers[0].lng : 126.53);

        const position = new window.kakao.maps.LatLng(centerLat, centerLng);
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: position,
          level,
        });

        // 단일 마커
        if (hasCoords && !hasMarkers) {
          const marker = new window.kakao.maps.Marker({ position });
          marker.setMap(map);
          if (name) {
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:5px 10px;font-size:12px;font-weight:bold;white-space:nowrap;">${name}</div>`,
            });
            infowindow.open(map, marker);
          }
        }

        // 다중 마커
        if (hasMarkers) {
          markers.forEach((m) => {
            const pos = new window.kakao.maps.LatLng(m.lat, m.lng);
            const marker = new window.kakao.maps.Marker({ position: pos, map });
            if (m.name) {
              const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:4px 8px;font-size:11px;font-weight:bold;white-space:nowrap;">${m.name}</div>`,
              });
              window.kakao.maps.event.addListener(marker, 'click', () => {
                infowindow.open(map, marker);
                if (onMarkerClickRef.current) onMarkerClickRef.current(m);
              });
            }
          });

          if (markers.length > 1) {
            const bounds = new window.kakao.maps.LatLngBounds();
            markers.forEach((m) => bounds.extend(new window.kakao.maps.LatLng(m.lat, m.lng)));
            map.setBounds(bounds);
          }
        }
      } catch (e) {
        console.error('카카오맵 초기화 오류', e);
      } finally {
        setMapLoaded(true);
      }
    };

    if (window.kakao?.maps?.Map) {
      initMap();
      return;
    }
    if (window.kakao?.maps?.load) {
      window.kakao.maps.load(initMap);
      return;
    }

    let retryCount = 0;
    const interval = setInterval(() => {
      retryCount++;
      if (window.kakao?.maps?.Map) {
        clearInterval(interval);
        initMap();
      } else if (window.kakao?.maps?.load) {
        clearInterval(interval);
        window.kakao.maps.load(initMap);
      } else if (retryCount > 20) {
        clearInterval(interval);
        setMapLoaded(true); // SDK 로드 실패 시 로딩 상태 해제
      }
    }, 300);

    return () => clearInterval(interval);
  // onMarkerClick 제외 – ref로 처리
  }, [lat, lng, level, name, markers]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasCoords = lat && lng;
  const hasMarkers = markers && markers.length > 0;

  if (!hasCoords && !hasMarkers) {
    return (
      <a
        href={`https://map.kakao.com/link/search/${encodeURIComponent(name + ' 제주')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-sky-100 rounded-xl border border-sky-100 hover:border-sky-300 transition-all cursor-pointer"
        style={{ height }}
      >
        <MapPin className="w-8 h-8 text-sky-500 mb-2" />
        <span className="text-sm font-semibold text-sky-700">카카오맵에서 검색</span>
        <span className="text-xs text-sky-400 mt-0.5">클릭하면 지도가 열립니다</span>
      </a>
    );
  }

  return (
    <div>
      {/* position:relative 래퍼로 로딩 오버레이를 절대 위치로 처리 */}
      <div style={{ position: 'relative', width: '100%', height }}>
        <div
          ref={mapRef}
          className="rounded-xl overflow-hidden border border-slate-200"
          style={{ width: '100%', height: '100%' }}
        />
        {!mapLoaded && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200"
          >
            <div className="text-center">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-1" />
              <p className="text-xs text-slate-400">지도 불러오는 중...</p>
            </div>
          </div>
        )}
      </div>
      {/* 길찾기 버튼 (단일 마커일 때만) */}
      {hasCoords && name && (
        <div className="flex gap-2 mt-2">
          <a
            href={`https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#FEE500] hover:bg-[#FDD800] rounded-xl text-xs font-bold text-[#3C1E1E] transition-colors shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" /> 길찾기
          </a>
          <a
            href={`https://map.naver.com/p/search/${encodeURIComponent(name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#03C75A] hover:bg-[#02b350] rounded-xl text-xs font-bold text-white transition-colors shadow-sm"
          >
            네이버지도
          </a>
        </div>
      )}
    </div>
  );
}
