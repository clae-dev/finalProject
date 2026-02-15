import { axiosApi } from "../core/axiosAPI";

/**
 * 공지사항 API
 */

// 공지 목록 (사용자용)
export const getNoticeList = async (page = 1, size = 10, search = '') => {
  const params = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/notices", { params });
  return response.data;
};

// 공지 상세 조회
export const getNoticeDetail = async (boardNo) => {
  const response = await axiosApi.get(`/api/notices/${boardNo}`);
  return response.data;
};

// 관리자 공지 목록
export const getAdminNoticeList = async (page = 1, size = 10, search = '') => {
  const params = { page, size };
  if (search) params.search = search;
  const response = await axiosApi.get("/api/admin/notices", { params });
  return response.data;
};

// 공지 작성
export const createNotice = async (notice) => {
  const response = await axiosApi.post("/api/admin/notices", notice);
  return response.data;
};

// 공지 수정
export const updateNotice = async (boardNo, notice) => {
  const response = await axiosApi.put(`/api/admin/notices/${boardNo}`, notice);
  return response.data;
};

// 공지 삭제
export const deleteNotice = async (boardNo) => {
  const response = await axiosApi.delete(`/api/admin/notices/${boardNo}`);
  return response.data;
};
