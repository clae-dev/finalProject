/**
 * 토큰 저장소 유틸리티
 * - 인증 토큰은 항상 localStorage에 저장 (브라우저 닫아도 유지)
 * - "아이디 저장" 기능은 별도 키로 관리
 */

const SAVED_EMAIL_KEY = "savedEmail";

/** 이메일 저장 */
export const saveEmail = (email) => {
  localStorage.setItem(SAVED_EMAIL_KEY, email);
};

/** 저장된 이메일 불러오기 */
export const getSavedEmail = () => {
  return localStorage.getItem(SAVED_EMAIL_KEY) || "";
};

/** 저장된 이메일 삭제 */
export const removeSavedEmail = () => {
  localStorage.removeItem(SAVED_EMAIL_KEY);
};

/** 토큰/유저 데이터 저장 */
export const saveToken = (key, value) => {
  localStorage.setItem(key, value);
};

/** 토큰/유저 데이터 읽기 */
export const getToken = (key) => {
  return localStorage.getItem(key);
};

/** 토큰/유저 데이터 삭제 */
export const removeToken = (key) => {
  localStorage.removeItem(key);
};

/** 모든 인증 데이터 삭제 */
export const clearAllAuth = () => {
  removeToken("accessToken");
  removeToken("refreshToken");
  removeToken("userData");
};
