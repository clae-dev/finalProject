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

// 그룹 메시지 목록 조회
export const getGroupMessages = async (groupRoomNo: number | string): Promise<ApiResponse<GroupMessage[]>> => {
  const response = await axiosApi.get("/api/group-chatting/messages", { params: { groupRoomNo } });
  return response.data;
};

// 그룹 읽음 처리
export const markGroupRead = async (groupRoomNo: number | string, lastReadMsgNo: number): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.put("/api/group-chatting/read", { groupRoomNo, lastReadMsgNo });
  return response.data;
};
