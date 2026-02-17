import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from './notificationAPI';
import { getToken } from '../core/tokenStorage';

/**
 * 알림 목록 조회 훅
 */
export const useNotifications = (page = 1, size = 20) => {
  return useQuery({
    queryKey: ['notifications', page, size],
    queryFn: () => getNotifications(page, size),
    enabled: !!getToken('accessToken'),
  });
};

/**
 * 읽지 않은 알림 수 훅
 */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unreadCount'],
    queryFn: () => getUnreadCount(),
    enabled: !!getToken('accessToken'),
    refetchInterval: 30000, // 30초마다 폴링 (WebSocket 보완용)
  });
};

/**
 * 단건 읽음 처리 훅
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationNo) => markAsRead(notificationNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * 전체 읽음 처리 훅
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * 알림 삭제 훅
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationNo) => deleteNotification(notificationNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
