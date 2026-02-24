import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse, Notice, PageResponse } from "../../types";

/**
 * 공지사항 API
 */

// 공지 목록 (사용자용)
export const getNoticeList = async (
  page = 1,
  size = 10,
  search = ''
): Promise<ApiResponse<PageResponse<Notice>>> => {
  const params: Record<string, unknown> = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/notices", { params });
  return response.data;
};

// 공지 상세 조회
export const getNoticeDetail = async (boardNo: number | string): Promise<ApiResponse<Notice>> => {
  const response = await axiosApi.get(`/api/notices/${boardNo}`);
  return response.data;
};

// 관리자 공지 목록
export const getAdminNoticeList = async (
  page = 1,
  size = 10,
  search = ''
): Promise<ApiResponse<PageResponse<Notice>>> => {
  const params: Record<string, unknown> = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/admin/notices", { params });
  return response.data;
};

// 공지 작성
export const createNotice = async (notice: Partial<Notice>): Promise<ApiResponse<Notice>> => {
  const response = await axiosApi.post("/api/admin/notices", notice);
  return response.data;
};

// 공지 수정
export const updateNotice = async (
  boardNo: number | string,
  notice: Partial<Notice>
): Promise<ApiResponse<Notice>> => {
  const response = await axiosApi.put(`/api/admin/notices/${boardNo}`, notice);
  return response.data;
};

// 공지 삭제
export const deleteNotice = async (boardNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.delete(`/api/admin/notices/${boardNo}`);
  return response.data;
};
