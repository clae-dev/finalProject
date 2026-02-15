import { axiosApi } from "../core/axiosAPI";

/**
 * AI 채팅 API
 */

// AI 채팅 메시지 전송
export const sendAiChat = async (message, history) => {
  const response = await axiosApi.post("/api/ai/chat", { message, history });
  return response.data;
};
