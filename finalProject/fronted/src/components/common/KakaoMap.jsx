import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function KakaoMap({
  lat,
  lng,
  level = 3,
  name = '',
  markers = [],
  height = '220px',
  onMarkerClick,
  panToMarker,   // { lat, lng, name } — 변경 시 해당 위치로 지도 이동 + InfoWindow 열기
  onMapReady,    // (mapInstance) — 맵 초기화 완료 시 콜백
}) {
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const callbackRef = useRef(onMarkerClick);
  const markerObjs  = useRef([]); // [{ marker, iw, data }]
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => { callbackRef.current = onMarkerClick; }, [onMarkerClick]);

  // panToMarker 변경 시 지도 이동 + InfoWindow 열기 / null이면 모두 닫기
  useEffect(() => {
    if (!mapInstance.current || !window.kakao?.maps?.LatLng) return;

    if (!panToMarker) {
      // 선택 해제 → 모든 InfoWindow 닫기
      markerObjs.current.forEach(obj => obj.iw?.close());
      return;
    }

    const map = mapInstance.current;
    const pos = new window.kakao.maps.LatLng(panToMarker.lat, panToMarker.lng);
    map.panTo(pos);
    const found = markerObjs.current.find(obj => obj.data.name === panToMarker.name);
    if (found?.iw && found?.marker) {
      found.iw.open(map, found.marker);
    }
  }, [panToMarker?.lat, panToMarker?.lng, panToMarker?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    const hasCoords  = lat != null && lng != null;
    const hasMarkers = markers && markers.length > 0;
    if (!hasCoords && !hasMarkers) { setStatus('error'); return; }

    const buildMap = () => {
      try {
        const centerLat = hasCoords ? lat : markers[0].lat;
        const centerLng = hasCoords ? lng : markers[0].lng;

        const map = new window.kakao.maps.Map(el, {
          center: new window.kakao.maps.LatLng(centerLat, centerLng),
          level,
        });
        mapInstance.current = map;
        markerObjs.current = [];

        if (hasCoords && !hasMarkers) {
          // 단일 마커
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(lat, lng),
          });
          marker.setMap(map);
          if (name) {
            const iw = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:5px 10px;font-size:12px;font-weight:bold;white-space:nowrap;">${name}</div>`,
            });
            iw.open(map, marker);
          }
        } else if (hasMarkers) {
          // 다중 마커
          markers.forEach((m) => {
            const pos    = new window.kakao.maps.LatLng(m.lat, m.lng);
            const marker = new window.kakao.maps.Marker({ position: pos, map });
            let iw = null;
            if (m.name) {
              iw = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:4px 8px;font-size:11px;font-weight:bold;white-space:nowrap;">${m.name}</div>`,
              });
              window.kakao.maps.event.addListener(marker, 'click', () => {
                iw.open(map, marker);
                if (callbackRef.current) callbackRef.current(m);
              });
            }
            markerObjs.current.push({ marker, iw, data: m });
          });
        }

        setStatus('ready');
        if (onMapReady) onMapReady(map);
      } catch (err) {
        console.error('[KakaoMap] 초기화 실패:', err);
        setStatus('error');
      }
    };

    const tryInit = () => {
      if (window.kakao?.maps?.Map) {
        buildMap();
        return true;
      }
      if (window.kakao?.maps?.load) {
        window.kakao.maps.load(buildMap);
        return true;
      }
      return false;
    };

    if (tryInit()) return;

    // SDK 아직 로드 안 됨 → 폴링
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (tryInit()) { clearInterval(timer); return; }
      if (tries >= 30) {
        clearInterval(timer);
        setStatus('error');
      }
    }, 200);

    return () => clearInterval(timer);
  // markers는 module-level 상수이므로 안정적
  }, [lat, lng, level, name]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasCoords  = lat != null && lng != null;
  const hasMarkers = markers && markers.length > 0;

  if (!hasCoords && !hasMarkers) {
    return (
      <a
        href={`https://map.kakao.com/link/search/${encodeURIComponent((name || '제주') + ' 제주')}`}
        target="_blank" rel="noopener noreferrer"
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
      <div style={{ position: 'relative', width: '100%', height }}>
        {/* 지도 컨테이너 – 항상 렌더, 높이 명시 */}
        <div
          ref={mapRef}
          className="rounded-xl overflow-hidden border border-slate-200"
          style={{ width: '100%', height }}
        />

        {/* 로딩 중 */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-sky-300 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-400">지도 불러오는 중...</p>
            </div>
          </div>
        )}

        {/* 실패 시 카카오맵 링크 */}
        {status === 'error' && (
          <a
            href={`https://map.kakao.com/link/search/${encodeURIComponent((name || '제주도') + ' 제주')}`}
            target="_blank" rel="noopener noreferrer"
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-sky-100 rounded-xl border border-sky-100 hover:border-sky-300 transition-all cursor-pointer"
          >
            <MapPin className="w-8 h-8 text-sky-500 mb-2" />
            <span className="text-sm font-semibold text-sky-700">카카오맵에서 보기</span>
            <span className="text-xs text-sky-400 mt-0.5">클릭하면 지도가 열립니다</span>
          </a>
        )}
      </div>

      {/* 길찾기 버튼 (단일 마커일 때만) */}
      {hasCoords && name && (
        <div className="flex gap-2 mt-2">
          <a
            href={`https://map.kakao.com/link/to/${encodeURIComponent(name)},${lat},${lng}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#FEE500] hover:bg-[#FDD800] rounded-xl text-xs font-bold text-[#3C1E1E] transition-colors shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" /> 길찾기
          </a>
          <a
            href={`https://map.naver.com/p/search/${encodeURIComponent(name)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#03C75A] hover:bg-[#02b350] rounded-xl text-xs font-bold text-white transition-colors shadow-sm"
          >
            네이버지도
          </a>
        </div>
      )}
    </div>
  );
}
