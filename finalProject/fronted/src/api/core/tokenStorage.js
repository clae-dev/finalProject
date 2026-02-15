/**
 * 토큰 저장소 유틸리티
 * - "로그인 유지" 체크 시 → localStorage (브라우저 닫아도 유지)
 * - 미체크 시 → sessionStorage (브라우저 닫으면 삭제)
 */

const REMEMBER_KEY = "rememberMe";

/** "로그인 유지" 여부 저장 (항상 localStorage에 저장) */
export const setRememberMe = (value) => {
  localStorage.setItem(REMEMBER_KEY, value ? "true" : "false");
};

/** "로그인 유지" 여부 확인 */
export const getRememberMe = () => {
  return localStorage.getItem(REMEMBER_KEY) === "true";
};

/** 현재 설정에 맞는 Storage 반환 */
const getStorage = () => {
  return getRememberMe() ? localStorage : sessionStorage;
};

/** 토큰/유저 데이터 저장 */
export const saveToken = (key, value) => {
  getStorage().setItem(key, value);
};

/** 토큰/유저 데이터 읽기 (양쪽 Storage 모두 확인) */
export const getToken = (key) => {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
};

/** 토큰/유저 데이터 삭제 (양쪽 모두 삭제) */
export const removeToken = (key) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

/** 모든 인증 데이터 삭제 */
export const clearAllAuth = () => {
  removeToken("accessToken");
  removeToken("refreshToken");
  removeToken("userData");
  localStorage.removeItem(REMEMBER_KEY);
};
