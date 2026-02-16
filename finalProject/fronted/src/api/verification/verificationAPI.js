import { axiosApi } from "../core/axiosAPI";

// 인증서류 제출
export const submitVerification = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosApi.post("/api/member/verification", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 내 인증 상태 조회
export const getVerificationStatus = async () => {
  const response = await axiosApi.get("/api/member/verification/status");
  return response.data;
};
