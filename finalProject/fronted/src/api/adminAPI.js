import { axiosApi } from "./axiosAPI";

/**
 * 관리자 API
 */

// 대시보드 통계
export const getDashboard = async () => {
  const response = await axiosApi.get("/api/admin/dashboard");
  return response.data;
};

// 회원 목록
export const getMembers = async (page = 1, size = 10, search = '', searchType = '') => {
  const params = { page, size };
  if (search) params.search = search;
  if (searchType) params.searchType = searchType;
  const response = await axiosApi.get("/api/admin/members", { params });
  return response.data;
};

// 회원 상태 변경
export const updateMemberStatus = async (memberNo, status) => {
  const response = await axiosApi.put(`/api/admin/members/${memberNo}/status`, { status });
  return response.data;
};

// 동행 목록
export const getAdminCompanions = async (page = 1, size = 10, search = '') => {
  const params = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/admin/companions", { params });
  return response.data;
};

// 동행 삭제
export const deleteAdminCompanion = async (companionNo) => {
  const response = await axiosApi.delete(`/api/admin/companions/${companionNo}`);
  return response.data;
};

// 후기 목록
export const getAdminReviews = async (page = 1, size = 10, search = '') => {
  const params = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/admin/reviews", { params });
  return response.data;
};

// 후기 삭제
export const deleteAdminReview = async (reviewNo) => {
  const response = await axiosApi.delete(`/api/admin/reviews/${reviewNo}`);
  return response.data;
};

// 숙소 목록
export const getAdminAccommodations = async (page = 1, size = 10, search = '') => {
  const params = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/admin/accommodations", { params });
  return response.data;
};

// 숙소 상태 변경
export const updateAccommodationStatus = async (accommodationNo, status) => {
  const response = await axiosApi.put(`/api/admin/accommodations/${accommodationNo}/status`, { status });
  return response.data;
};
