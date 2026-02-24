import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse, Member, Companion, AccommodationReview, Report, DashboardStats, PageResponse } from "../../types";

/**
 * 관리자 API
 */

// 대시보드 통계
export const getDashboard = async (): Promise<ApiResponse<DashboardStats>> => {
  const response = await axiosApi.get("/api/admin/dashboard");
  return response.data;
};

// 회원 목록
export const getMembers = async (
  page = 1,
  size = 10,
  search = '',
  searchType = ''
): Promise<ApiResponse<PageResponse<Member>>> => {
  const params: Record<string, unknown> = { page, size };
  if (search) params.search = search;
  if (searchType) params.searchType = searchType;
  const response = await axiosApi.get("/api/admin/members", { params });
  return response.data;
};

// 회원 상태 변경
export const updateMemberStatus = async (
  memberNo: number | string,
  status: string
): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.put(`/api/admin/members/${memberNo}/status`, { status });
  return response.data;
};

// 동행 목록
export const getAdminCompanions = async (
  page = 1,
  size = 10,
  search = ''
): Promise<ApiResponse<PageResponse<Companion>>> => {
  const params: Record<string, unknown> = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/admin/companions", { params });
  return response.data;
};

// 동행 삭제
export const deleteAdminCompanion = async (companionNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.delete(`/api/admin/companions/${companionNo}`);
  return response.data;
};

// 후기 목록
export const getAdminReviews = async (
  page = 1,
  size = 10,
  search = ''
): Promise<ApiResponse<PageResponse<unknown>>> => {
  const params: Record<string, unknown> = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/admin/reviews", { params });
  return response.data;
};

// 후기 삭제
export const deleteAdminReview = async (reviewNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.delete(`/api/admin/reviews/${reviewNo}`);
  return response.data;
};

// 숙소 목록
export const getAdminAccommodations = async (
  page = 1,
  size = 10,
  search = ''
): Promise<ApiResponse<PageResponse<unknown>>> => {
  const params: Record<string, unknown> = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/admin/accommodations", { params });
  return response.data;
};

// 숙소 상태 변경
export const updateAccommodationStatus = async (
  accommodationNo: number | string,
  status: string
): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.put(`/api/admin/accommodations/${accommodationNo}/status`, { status });
  return response.data;
};

// 숙소 추가 (FormData multipart)
export const createAccommodation = async (formData: FormData): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.post("/api/admin/accommodations", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

// 숙소 수정 (FormData multipart — POST로 처리)
export const updateAccommodation = async (
  accommodationNo: number | string,
  formData: FormData
): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.post(`/api/admin/accommodations/${accommodationNo}/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

// 숙소 삭제
export const deleteAccommodation = async (accommodationNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.delete(`/api/admin/accommodations/${accommodationNo}`);
  return response.data;
};

// 신고 목록
export const getAdminReports = async (
  page = 1,
  size = 10,
  status = '',
  targetType = ''
): Promise<ApiResponse<PageResponse<Report>>> => {
  const params: Record<string, unknown> = { page, size };
  if (status) params.status = status;
  if (targetType) params.targetType = targetType;
  const response = await axiosApi.get("/api/admin/reports", { params });
  return response.data;
};

// 신고 상세
export const getAdminReportDetail = async (reportNo: number | string): Promise<ApiResponse<Report>> => {
  const response = await axiosApi.get(`/api/admin/reports/${reportNo}`);
  return response.data;
};

// 신고 상태 변경
export const updateReportStatus = async (
  reportNo: number | string,
  status: string,
  result: string
): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.put(`/api/admin/reports/${reportNo}/status`, { status, result });
  return response.data;
};

// 대기중 신고 건수
export const getPendingReportCount = async (): Promise<ApiResponse<number>> => {
  const response = await axiosApi.get("/api/admin/reports/count");
  return response.data;
};

// ===== 인증 관리 =====

// 인증 요청 목록
export const getAdminVerifications = async (
  page = 1,
  size = 10,
  status = ''
): Promise<ApiResponse<PageResponse<unknown>>> => {
  const params: Record<string, unknown> = { page, size };
  if (status) params.status = status;
  const response = await axiosApi.get("/api/admin/verifications", { params });
  return response.data;
};

// 인증 승인
export const approveVerification = async (verificationNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.put(`/api/admin/verifications/${verificationNo}/approve`);
  return response.data;
};

// 인증 거부
export const rejectVerification = async (
  verificationNo: number | string,
  adminComment: string
): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.put(`/api/admin/verifications/${verificationNo}/reject`, { adminComment });
  return response.data;
};

// ===== 숙소 후기 관리 =====

// 숙소 후기 목록
export const getAdminAccommodationReviews = async (
  page = 1,
  size = 10,
  search = ''
): Promise<ApiResponse<PageResponse<AccommodationReview>>> => {
  const params: Record<string, unknown> = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/admin/accommodation-reviews", { params });
  return response.data;
};

// 숙소 후기 삭제
export const deleteAdminAccommodationReview = async (reviewNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.delete(`/api/admin/accommodation-reviews/${reviewNo}`);
  return response.data;
};
