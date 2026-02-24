import { useMutation } from '@tanstack/react-query';
import { sendAiChat } from './aiChatAPI';
import type { AiChatHistory } from '../../types';

/**
 * AI 채팅 전송 훅
 */
export const useSendAiChat = () => {
  return useMutation({
    mutationFn: ({ message, history }: { message: string; history: AiChatHistory[] }) =>
      sendAiChat(message, history),
  });
};
