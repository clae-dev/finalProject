import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse, Spot } from "../../types";

/**
 * 명소 API
 */

// 활성 명소 목록 (메인페이지용)
export const getActiveSpots = async (): Promise<ApiResponse<Spot[]>> => {
  const response = await axiosApi.get("/api/spot");
  return response.data;
};

// 전체 명소 목록 (관리자용)
export const getAllSpots = async (): Promise<ApiResponse<Spot[]>> => {
  const response = await axiosApi.get("/api/spot/admin");
  return response.data;
};

// 명소 상세 조회
export const getSpotDetail = async (spotNo: number | string): Promise<ApiResponse<Spot>> => {
  const response = await axiosApi.get(`/api/spot/${spotNo}`);
  return response.data;
};

// 명소 등록 (FormData multipart)
export const createSpot = async (formData: FormData): Promise<ApiResponse<Spot>> => {
  const response = await axiosApi.post("/api/spot", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

// 명소 수정 (FormData multipart — POST로 처리)
export const updateSpot = async (
  spotNo: number | string,
  formData: FormData
): Promise<ApiResponse<Spot>> => {
  const response = await axiosApi.post(`/api/spot/${spotNo}/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

// 명소 삭제
export const deleteSpot = async (spotNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.delete(`/api/spot/${spotNo}`);
  return response.data;
};

// 명소 상태 변경
export const updateSpotStatus = async (
  spotNo: number | string,
  status: string
): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.put(`/api/spot/${spotNo}/status`, null, {
    params: { status }
  });
  return response.data;
};
