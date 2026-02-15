import { axiosApi } from "../core/axiosAPI";

/**
 * 채팅 API
 */

// 채팅방 목록 조회
export const getRoomList = async () => {
  const response = await axiosApi.get("/api/chatting/rooms");
  return response.data;
};

// 대화 상대 검색
export const searchTarget = async (query) => {
  const response = await axiosApi.get("/api/chatting/search", { params: { query } });
  return response.data;
};

// 채팅방 입장/생성
export const enterRoom = async (targetNo) => {
  const response = await axiosApi.get("/api/chatting/enter", { params: { targetNo } });
  return response.data;
};

// 메시지 목록 조회
export const getMessages = async (chattingRoomNo) => {
  const response = await axiosApi.get("/api/chatting/messages", { params: { chattingRoomNo } });
  return response.data;
};

// 읽음 처리
export const updateReadFlag = async (chattingRoomNo) => {
  const response = await axiosApi.put("/api/chatting/read", { chattingRoomNo });
  return response.data;
};
