import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse, GroupChatRoom, GroupMessage } from "../../types";

/**
 * 그룹 채팅 API
 */

// 그룹 채팅방 목록 조회
export const getGroupRoomList = async (): Promise<ApiResponse<GroupChatRoom[]>> => {
  const response = await axiosApi.get("/api/group-chatting/rooms");
  return response.data;
};

// 그룹 메시지 목록 조회 (커서 기반 페이징)
export const getGroupMessages = async (
  groupRoomNo: number | string,
  beforeMsgNo?: number,
  limit = 50
): Promise<ApiResponse<GroupMessage[]>> => {
  const params: Record<string, unknown> = { groupRoomNo, limit };
  if (beforeMsgNo) params.beforeMsgNo = beforeMsgNo;
  const response = await axiosApi.get("/api/group-chatting/messages", { params });
  return response.data;
};

// 그룹 읽음 처리
export const markGroupRead = async (groupRoomNo: number | string, lastReadMsgNo: number): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.put("/api/group-chatting/read", { groupRoomNo, lastReadMsgNo });
  return response.data;
};
