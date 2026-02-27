import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoomList, searchTarget, getMessages, enterRoom, updateReadFlag } from './chattingAPI';
import { getToken } from '../core/tokenStorage';

/**
 * 채팅방 목록 조회 훅
 */
export const useRoomList = (enabled = true) => {
  return useQuery({
    queryKey: ['chattingRooms'],
    queryFn: getRoomList,
    refetchInterval: 5000,
    enabled: enabled && !!getToken('accessToken'),
    retry: false,
  });
};

/**
 * 대화 상대 검색 훅
 * @param query - 검색어
 */
export const useSearchTarget = (query: string) => {
  return useQuery({
    queryKey: ['searchTarget', query],
    queryFn: () => searchTarget(query),
    enabled: !!query && query.length >= 1,
  });
};

/**
 * 메시지 목록 조회 훅
 * @param chattingRoomNo - 채팅방 번호
 */
export const useMessages = (chattingRoomNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['messages', chattingRoomNo],
    queryFn: () => getMessages(chattingRoomNo!),
    enabled: !!chattingRoomNo,
    refetchInterval: 3000,
  });
};

/**
 * 채팅방 입장/생성 훅
 */
export const useEnterRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (targetNo: number | string) => enterRoom(targetNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chattingRooms'] });
    },
  });
};

/**
 * 읽음 처리 훅
 */
export const useUpdateReadFlag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chattingRoomNo: number | string) => updateReadFlag(chattingRoomNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chattingRooms'] });
    },
  });
};
