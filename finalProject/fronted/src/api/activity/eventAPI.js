import { axiosApi } from "../core/axiosAPI";

// 공공 행사 목록 조회 (TourAPI 프록시)
export const getEventList = async (page = 1, size = 9) => {
  const startDate = (new Date().getFullYear() - 1) + "0101";
  const response = await axiosApi.get("/api/events", { params: { page, size, startDate } });
  return response.data;
};
