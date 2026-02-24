import { axiosApi } from "../core/axiosAPI";
import type { ApiResponse, AiChatHistory, AiChatResponse } from "../../types";

/**
 * AI 채팅 API
 */

// AI 채팅 메시지 전송
export const sendAiChat = async (
  message: string,
  history: AiChatHistory[]
): Promise<ApiResponse<AiChatResponse>> => {
  const response = await axiosApi.post("/api/ai/chat", { message, history });
  return response.data;
};
