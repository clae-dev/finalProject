import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Droplets, Wind, CloudRain, Navigation, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getJejuWeather, getJejuForecast } from '../../api/weather/weatherAPI';

const SKY_MAP = {
  1: { text: '맑음', emoji: '☀️' },
  3: { text: '구름많음', emoji: '⛅' },
  4: { text: '흐림', emoji: '☁️' },
};

const PTY_MAP = {
  1: { text: '비', emoji: '🌧️' },
  2: { text: '비/눈', emoji: '🌨️' },
  3: { text: '눈', emoji: '❄️' },
  5: { text: '빗방울', emoji: '🌦️' },
  6: { text: '빗방울눈날림', emoji: '🌨️' },
  7: { text: '눈날림', emoji: '🌬️' },
};

const CITIES = [
  { key: 'jeju', label: '제주시' },
  { key: 'seogwipo', label: '서귀포시' },
];

function getWeatherDisplay(sky, ptyCode) {
  if (ptyCode > 0 && PTY_MAP[ptyCode]) return PTY_MAP[ptyCode];
  return SKY_MAP[sky] || SKY_MAP[1];
}

function windDirText(deg) {
  const dirs = ['북', '북북동', '북동', '동북동', '동', '동남동', '남동', '남남동', '남', '남남서', '남서', '서남서', '서', '서북서', '북서', '북북서'];
  return dirs[Math.round(deg / 22.5) % 16];
}

const MODES = [
  { key: 'current', label: '지금' },
  { key: 'forecast', label: '예보' },
];

function WeatherWidget() {
  const [expanded, setExpanded] = useState(true);
  const [city, setCity] = useState('jeju');
  const [mode, setMode] = useState('current');
  const constraintsRef = useRef(null);
  const dragY = useMotionValue(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['jejuWeather', city],
    queryFn: () => getJejuWeather(city),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const { data: forecastData, isLoading: forecastLoading } = useQuery({
    queryKey: ['jejuForecast', city],
    queryFn: () => getJejuForecast(city),
    staleTime: 60 * 60 * 1000,
    retry: 1,
    enabled: mode === 'forecast',
  });

  if (isError || (!isLoading && !data?.success)) return null;

  const w = data?.data;
  const weather = w ? getWeatherDisplay(w.sky, w.ptyCode) : null;
  const cityLabel = CITIES.find(c => c.key === city)?.label || '제주시';

  return (
    <>
    {/* 드래그 범위: 뷰포트 전체 */}
    <div ref={constraintsRef} className="fixed inset-0 z-30 pointer-events-none" />
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.5 }}
      drag="y"
      dragConstraints={constraintsRef}
      dragElastic={0.1}
      dragMomentum={false}
      style={{ y: dragY }}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-40 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-stretch">
        {/* 위젯 본체 */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="w-52 bg-white/95 backdrop-blur-md rounded-r-2xl shadow-xl shadow-sky-200/40 border border-l-0 border-sky-100/80">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
                  </div>
                ) : w && (
                  <>
                    {/* 메인: 아이콘 + 온도 */}
                    <div className="px-4 pt-4 pb-3 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-tr-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{weather.emoji}</span>
                        <div>
                          <p className="text-2xl font-black text-white leading-none font-gmarket">
                            {w.temp}°
                          </p>
                          <p className="text-xs text-white/70 font-medium mt-1">{weather.text}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-white/50 mt-2">{cityLabel} · {w.fcstTime.slice(0, 2)}시 예보</p>
                    </div>

                    {/* 도시 선택 탭 */}
                    <div className="flex border-b border-sky-100/60">
                      {CITIES.map(c => (
                        <button
                          key={c.key}
                          onClick={() => setCity(c.key)}
                          className={`flex-1 py-2 text-xs font-bold transition-colors ${
                            city === c.key
                              ? 'text-sky-600 bg-sky-50/80 border-b-2 border-sky-500'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>

                    {/* 지금 / 예보 모드 탭 */}
                    <div className="flex border-b border-sky-100/60">
                      {MODES.map(m => (
                        <button
                          key={m.key}
                          onClick={() => setMode(m.key)}
                          className={`flex-1 py-1.5 text-[11px] font-semibold transition-colors ${
                            mode === m.key
                              ? 'text-cyan-600 bg-cyan-50/60 border-b-2 border-cyan-400'
                              : 'text-slate-400 hover:text-slate-500 hover:bg-slate-50/40'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    {/* 세부 정보 / 3일 예보 */}
                    {mode === 'current' ? (
                      <div className="px-3 py-3 space-y-1.5">
                        <Row icon={<Droplets className="w-3.5 h-3.5 text-blue-400" />} label="습도" value={`${w.humidity}%`} />
                        <Row icon={<Wind className="w-3.5 h-3.5 text-teal-400" />} label="풍속" value={`${w.windSpeed} m/s`} />
                        <Row icon={<Navigation className="w-3.5 h-3.5 text-indigo-400" />} label="풍향" value={windDirText(w.windDir)} />
                        <Row icon={<CloudRain className="w-3.5 h-3.5 text-sky-400" />} label="강수" value={w.rain > 0 ? `${w.rain}mm` : '없음'} />
                      </div>
                    ) : (
                      <div className="px-3 py-3 space-y-1">
                        {forecastLoading ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
                          </div>
                        ) : (
                          (forecastData?.data || []).map(day => (
                            <ForecastRow key={day.date} day={day} />
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 토글 탭 */}
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="flex items-center justify-center w-7 bg-white/95 backdrop-blur-md border border-l-0 border-sky-100/80 rounded-r-xl shadow-lg shadow-sky-200/30 hover:bg-sky-50 transition-colors self-center h-16"
        >
          {expanded ? (
            <ChevronLeft className="w-4 h-4 text-sky-500" />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm leading-none">{weather?.emoji || '🌤️'}</span>
              <span className="text-[10px] font-bold text-slate-600">{w ? `${w.temp}°` : ''}</span>
              <ChevronRight className="w-3 h-3 text-sky-400" />
            </div>
          )}
        </button>
      </div>
    </motion.div>
    </>
  );
}

export default React.memo(WeatherWidget);

const Row = React.memo(function Row({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-sky-50/60 transition-colors">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[11px] text-slate-400">{label}</span>
      </div>
      <span className="text-xs font-bold text-slate-700">{value}</span>
    </div>
  );
});

const ForecastRow = React.memo(function ForecastRow({ day }) {
  const wx = day.ptyCode > 0 && PTY_MAP[day.ptyCode]
    ? PTY_MAP[day.ptyCode]
    : (SKY_MAP[day.sky] || SKY_MAP[1]);

  return (
    <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-sky-50/60 transition-colors">
      <span className="text-[11px] font-semibold text-slate-500 w-8">{day.label}</span>
      <span className="text-base leading-none">{wx.emoji}</span>
      <span className="text-[11px] font-bold">
        <span className="text-blue-400">{day.tmin}°</span>
        <span className="text-slate-300 mx-0.5">/</span>
        <span className="text-red-400">{day.tmax}°</span>
      </span>
    </div>
  );
});
