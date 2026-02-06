import { axiosApi } from "./axiosAPI";

/**
 * 숙소 API
 */

// 숙소 목록 조회
export const getAccommodationList = async (page = 1, size = 20, region = null) => {
  const params = { page, size };
  if (region && region !== 'all') {
    params.region = region;
  }
  const response = await axiosApi.get("/api/accommodations", { params });
  return response.data;
};

// 숙소 상세 조회
export const getAccommodationDetail = async (accommodationNo) => {
  const response = await axiosApi.get(`/api/accommodations/${accommodationNo}`);
  return response.data;
};

// 숙소 데이터 동기화 (관리자용)
export const syncAccommodations = async () => {
  const response = await axiosApi.post("/api/accommodations/sync");
  return response.data;
};
