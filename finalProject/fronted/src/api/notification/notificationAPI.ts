import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse, Notification, PageResponse } from "../../types";

/**
 * 알림 REST API
 */

// 알림 목록 조회 (페이징)
export const getNotifications = async (
  page = 1,
  size = 20
): Promise<ApiResponse<PageResponse<Notification>>> => {
  const response = await axiosApi.get("/api/notifications", {
    params: { page, size },
  });
  return response.data;
};

// 읽지 않은 알림 수
export const getUnreadCount = async (): Promise<ApiResponse<number>> => {
  const response = await axiosApi.get("/api/notifications/unread-count");
  return response.data;
};

// 단건 읽음 처리
export const markAsRead = async (notificationNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.put(`/api/notifications/${notificationNo}/read`);
  return response.data;
};

// 전체 읽음 처리
export const markAllAsRead = async (): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.put("/api/notifications/read-all");
  return response.data;
};

// 알림 삭제
export const deleteNotification = async (notificationNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.delete(`/api/notifications/${notificationNo}`);
  return response.data;
};

// 알림 전체 삭제
export const deleteAllNotifications = async (): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.delete('/api/notifications/all');
  return response.data;
};
