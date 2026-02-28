/** 동행 관련 공용 유틸 — Companions.jsx, CompanionsSection.jsx 공유 */

export function getDday(travelDate) {
  if (!travelDate) return null;
  let target;
  const isoMatch = travelDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    target = new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
  } else {
    const match = travelDate.match(/(\d{1,2})\.(\d{1,2})/);
    if (!match) return null;
    const now = new Date();
    const year = now.getFullYear();
    target = new Date(year, parseInt(match[1]) - 1, parseInt(match[2]));
    if (target < now) target.setFullYear(year + 1);
  }
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'D-Day';
  if (diff > 0) return `D-${diff}`;
  return null;
}

export function getDdayStyle(dday) {
  if (dday === 'D-Day') return 'bg-orange-500 text-white shadow-orange-300/60 animate-pulse';
  const n = parseInt(dday.replace('D-', ''), 10);
  if (n <= 3) return 'bg-red-500 text-white shadow-red-300/60';
  if (n <= 7) return 'bg-amber-400 text-white shadow-amber-300/60';
  return 'bg-white/95 text-sky-500 shadow-sky-100/60';
}

export function formatTravelDate(travelDate) {
  if (!travelDate) return '';
  const isoMatch = travelDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const d = new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
    return `${d.getMonth() + 1}.${d.getDate()}(${days[d.getDay()]})`;
  }
  return travelDate;
}
