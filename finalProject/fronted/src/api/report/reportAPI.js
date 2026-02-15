import { axiosApi } from "../core/axiosAPI";

/**
 * 신고 API
 */

// 신고 접수
export const submitReport = async (targetType, targetNo, reportType, detailReason) => {
  const response = await axiosApi.post("/api/reports", {
    targetType, targetNo, reportType, detailReason,
  });
  return response.data;
};

// 내가 이미 신고했는지 확인
export const checkReport = async (targetType, targetNo) => {
  const response = await axiosApi.get("/api/reports/check", {
    params: { targetType, targetNo },
  });
  return response.data;
};
