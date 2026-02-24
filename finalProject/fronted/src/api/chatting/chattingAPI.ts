import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse, ChattingRoom, Message, Member } from "../../types";

/**
 * 채팅 API
 */

// 채팅방 목록 조회
export const getRoomList = async (): Promise<ApiResponse<ChattingRoom[]>> => {
  const response = await axiosApi.get("/api/chatting/rooms");
  return response.data;
};

// 대화 상대 검색
export const searchTarget = async (query: string): Promise<ApiResponse<Member[]>> => {
  const response = await axiosApi.get("/api/chatting/search", { params: { query } });
  return response.data;
};

// 채팅방 입장/생성
export const enterRoom = async (targetNo: number | string): Promise<ApiResponse<ChattingRoom>> => {
  const response = await axiosApi.get("/api/chatting/enter", { params: { targetNo } });
  return response.data;
};

// 메시지 목록 조회
export const getMessages = async (chattingRoomNo: number | string): Promise<ApiResponse<Message[]>> => {
  const response = await axiosApi.get("/api/chatting/messages", { params: { chattingRoomNo } });
  return response.data;
};

// 읽음 처리
export const updateReadFlag = async (chattingRoomNo: number | string): Promise<ApiResponse<unknown>> => {
  const response = await axiosApi.put("/api/chatting/read", { chattingRoomNo });
  return response.data;
};
