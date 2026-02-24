import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse, Member } from "../../types";

/**
 * 회원 API
 */

// 회원 상세 조회
export const getMember = async (memberNo: number | string): Promise<ApiResponse<Member>> => {
  const response = await axiosApi.get(`/api/member/${memberNo}`);
  return response.data;
};

// 회원 활동 내역 조회
export const getMyActivity = async (memberNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.get(`/api/member/${memberNo}/activity`);
  return response.data;
};

// 회원 정보 수정
export const updateMember = async (
  memberNo: number | string,
  data: Partial<Member>
): Promise<ApiResponse<Member>> => {
  const response = await axiosApi.put(`/api/member/${memberNo}`, data);
  return response.data;
};

// 회원 탈퇴
export const withdrawMember = async (
  memberNo: number | string,
  memberPw: string
): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.delete(`/api/member/${memberNo}`, {
    params: { memberPw }
  });
  return response.data;
};

// 닉네임 중복 체크 (memberNo 전달 시 본인 제외)
export const checkNickname = async (
  nickname: string,
  memberNo?: number | string
): Promise<ApiResponse<boolean>> => {
  const params: Record<string, unknown> = { memberNickname: nickname };
  if (memberNo) {
    params.memberNo = memberNo;
  }
  const response = await axiosApi.get("/api/member/check-nickname", { params });
  return response.data;
};

// 비밀번호 변경 (로그인 상태에서 현재 비밀번호 확인 후)
export const resetPassword = async (data: {
  memberNo: number | string;
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.put(`/api/member/${data.memberNo}/change-password`, {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  });
  return response.data;
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (file: File): Promise<ApiResponse<{ imageUrl: string }>> => {
  const formData = new FormData();
  formData.append('profileImage', file);
  const response = await axiosApi.post("/api/member/profile-image", formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
