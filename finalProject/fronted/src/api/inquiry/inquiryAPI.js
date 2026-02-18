import { axiosApi } from "../core/axiosAPI";

// 문의 등록
export const createInquiry = async (inquiry) => {
  const response = await axiosApi.post("/api/inquiry", inquiry);
  return response.data;
};

// 내 문의 목록
export const getMyInquiries = async (page = 1, size = 10) => {
  const response = await axiosApi.get("/api/inquiry/my", { params: { page, size } });
  return response.data;
};

// 문의 상세 (사용자)
export const getInquiryDetail = async (inquiryNo) => {
  const response = await axiosApi.get(`/api/inquiry/${inquiryNo}`);
  return response.data;
};

// 문의 삭제 (사용자)
export const deleteInquiry = async (inquiryNo) => {
  const response = await axiosApi.delete(`/api/inquiry/${inquiryNo}`);
  return response.data;
};

// 관리자 문의 목록
export const getAdminInquiries = async (page = 1, size = 10, status = '') => {
  const params = { page, size };
  if (status) params.status = status;
  const response = await axiosApi.get("/api/admin/inquiry", { params });
  return response.data;
};

// 관리자 문의 상세
export const getAdminInquiryDetail = async (inquiryNo) => {
  const response = await axiosApi.get(`/api/admin/inquiry/${inquiryNo}`);
  return response.data;
};

// 관리자 답변 등록
export const answerInquiry = async (inquiryNo, answer) => {
  const response = await axiosApi.put(`/api/admin/inquiry/${inquiryNo}/answer`, { answer });
  return response.data;
};

// 관리자 문의 삭제
export const deleteAdminInquiry = async (inquiryNo) => {
  const response = await axiosApi.delete(`/api/admin/inquiry/${inquiryNo}`);
  return response.data;
};
