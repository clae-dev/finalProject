import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse, Companion, CompanionJoin, PageResponse } from "../../types";

/**
 * 동행 게시판 API
 */

// 목록 조회 (페이징 + 태그 필터)
export const getCompanionList = async (
  page = 1,
  size = 9,
  tag: string | null = null
): Promise<ApiResponse<PageResponse<Companion>>> => {
  const params: Record<string, unknown> = { page, size };
  if (tag && tag !== '전체') {
    params.tag = tag;
  }
  const response = await axiosApi.get("/api/companions", { params });
  return response.data;
};

// 상세 조회
export const getCompanionDetail = async (
  companionNo: number | string
): Promise<ApiResponse<Companion>> => {
  const response = await axiosApi.get(`/api/companions/${companionNo}`);
  return response.data;
};

// 작성 (multipart/form-data)
export const createCompanion = async (formData: FormData): Promise<ApiResponse<Companion>> => {
  const response = await axiosApi.post("/api/companions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 수정 (multipart/form-data)
export const updateCompanion = async (
  companionNo: number | string,
  formData: FormData
): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.put(`/api/companions/${companionNo}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 삭제
export const deleteCompanion = async (companionNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.delete(`/api/companions/${companionNo}`);
  return response.data;
};

// 참여 신청
export const joinCompanion = async (companionNo: number | string): Promise<ApiResponse<CompanionJoin>> => {
  const response = await axiosApi.post(`/api/companions/${companionNo}/join`);
  return response.data;
};

// 참여 취소
export const cancelJoin = async (companionNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.delete(`/api/companions/${companionNo}/join`);
  return response.data;
};

// 승인/거절
export const updateJoinStatus = async (
  joinNo: number | string,
  status: 'A' | 'R'
): Promise<ApiResponse<CompanionJoin>> => {
  const response = await axiosApi.put(`/api/companions/join/${joinNo}`, { status });
  return response.data;
};
