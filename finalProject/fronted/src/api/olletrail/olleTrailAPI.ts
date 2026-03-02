import { axiosApi } from "../core/axiosAPI";

export interface OlleTrailOverride {
  trailId: number;
  subtitle?: string;
  description?: string;
  difficulty?: string;
  duration?: string;
  terrain?: string;
  distance?: number;
  updatedAt?: string;
  updatedBy?: number;
}

export interface OlleOverrideListResponse {
  success: boolean;
  list: OlleTrailOverride[];
  message?: string;
}

export interface OlleOverrideResponse {
  success: boolean;
  message?: string;
}

/** 전체 override 목록 조회 (public) */
export const getOlleOverrides = async (): Promise<OlleOverrideListResponse> => {
  const response = await axiosApi.get("/api/olle-trails/overrides");
  return response.data;
};

/** override 저장·수정 (관리자 — JWT 자동 첨부) */
export const saveOlleOverride = async (
  trailId: number,
  data: Omit<OlleTrailOverride, "trailId" | "updatedAt" | "updatedBy">
): Promise<OlleOverrideResponse> => {
  const response = await axiosApi.put(`/api/olle-trails/${trailId}`, data);
  return response.data;
};

/** override 삭제 — 원본 복원 (관리자) */
export const deleteOlleOverride = async (
  trailId: number
): Promise<OlleOverrideResponse> => {
  const response = await axiosApi.delete(`/api/olle-trails/${trailId}`);
  return response.data;
};
