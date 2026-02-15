import { useMutation } from '@tanstack/react-query';
import { sendAiChat } from './aiChatAPI';

/**
 * AI 채팅 전송 훅
 */
export const useSendAiChat = () => {
  return useMutation({
    mutationFn: ({ message, history }) => sendAiChat(message, history),
  });
};
