import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse, Accommodation, PageResponse } from "../../types";

/**
 * 숙소 API
 */

// 숙소 목록 조회
export const getAccommodationList = async (
  page = 1,
  size = 20,
  region: string | null = null
): Promise<ApiResponse<PageResponse<Accommodation>>> => {
  const params: Record<string, unknown> = { page, size };
  if (region && region !== 'all') {
    params.region = region;
  }
  const response = await axiosApi.get("/api/accommodations", { params });
  return response.data;
};

// 숙소 상세 조회
export const getAccommodationDetail = async (
  accommodationNo: number | string
): Promise<ApiResponse<Accommodation>> => {
  const response = await axiosApi.get(`/api/accommodations/${accommodationNo}`);
  return response.data;
};

// 숙소 데이터 동기화 (관리자용)
export const syncAccommodations = async (): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.post("/api/accommodations/sync");
  return response.data;
};
