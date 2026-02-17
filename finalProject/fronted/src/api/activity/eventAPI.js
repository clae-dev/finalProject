/**
 * 공공 행사/레포츠 API 호출 함수 (TourAPI 프록시)
 */
import { axiosApi } from "../core/axiosAPI";

// 공공 행사 목록 조회 (TourAPI 프록시)
export const getEventList = async (page = 1, size = 9) => {
  const startDate = (new Date().getFullYear() - 1) + "0101";
  const response = await axiosApi.get("/api/events", { params: { page, size, startDate } });
  return response.data;
};

// 공공 레포츠/액티비티 목록 조회
export const getLeisureList = async (page = 1, size = 9) => {
  const response = await axiosApi.get("/api/leisure", { params: { page, size } });
  return response.data;
};
