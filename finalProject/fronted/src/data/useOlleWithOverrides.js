/**
 * localStorage 오버라이드를 정적 olleTrails 데이터 위에 병합해 반환
 * 관리자가 수정한 필드만 덮어씌우고 나머지(path, stamps 등)는 원본 유지
 */
import { olleTrails } from './olleTrails';

const STORAGE_KEY = 'olleTrailOverrides';

export function getOlleTrails() {
  try {
    const overrides = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (Object.keys(overrides).length === 0) return olleTrails;
    return olleTrails.map((trail) => ({
      ...trail,
      ...(overrides[trail.id] || {}),
    }));
  } catch {
    return olleTrails;
  }
}

export function getOlleTrailOverrides() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveOlleTrailOverride(id, fields) {
  const overrides = getOlleTrailOverrides();
  overrides[id] = { ...(overrides[id] || {}), ...fields };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function resetOlleTrailOverride(id) {
  const overrides = getOlleTrailOverrides();
  delete overrides[id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}
