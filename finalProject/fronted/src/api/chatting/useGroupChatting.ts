import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGroupRoomList, getGroupMessages, markGroupRead } from './groupChattingAPI';
import { getToken } from '../core/tokenStorage';

/**
 * 그룹 채팅방 목록 조회 훅
 */
export const useGroupRoomList = (enabled = true) => {
  return useQuery({
    queryKey: ['groupChattingRooms'],
    queryFn: getGroupRoomList,
    enabled: enabled && !!getToken('accessToken'),
    retry: false,
  });
};

/**
 * 그룹 메시지 목록 조회 훅
 */
export const useGroupMessages = (groupRoomNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['groupMessages', groupRoomNo],
    queryFn: () => getGroupMessages(groupRoomNo!),
    enabled: !!groupRoomNo,
  });
};

/**
 * 그룹 읽음 처리 훅
 */
export const useMarkGroupRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupRoomNo, lastReadMsgNo }: { groupRoomNo: number | string; lastReadMsgNo: number }) =>
      markGroupRead(groupRoomNo, lastReadMsgNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupChattingRooms'] });
    },
  });
};
