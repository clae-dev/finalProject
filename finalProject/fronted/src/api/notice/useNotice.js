import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNoticeList,
  getNoticeDetail,
  getAdminNoticeList,
  createNotice,
  updateNotice,
  deleteNotice,
} from './noticeAPI';

/** 공지 목록 (사용자용) */
export const useNoticeList = (page = 1, size = 10, search = '') => {
  return useQuery({
    queryKey: ['notices', page, size, search],
    queryFn: () => getNoticeList(page, size, search),
  });
};

/** 공지 상세 */
export const useNoticeDetail = (boardNo) => {
  return useQuery({
    queryKey: ['notice', boardNo],
    queryFn: () => getNoticeDetail(boardNo),
    enabled: !!boardNo,
  });
};

/** 관리자 공지 목록 */
export const useAdminNoticeList = (page = 1, size = 10, search = '') => {
  return useQuery({
    queryKey: ['admin', 'notices', page, size, search],
    queryFn: () => getAdminNoticeList(page, size, search),
  });
};

/** 공지 작성 */
export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notice) => createNotice(notice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] });
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
};

/** 공지 수정 */
export const useUpdateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardNo, ...notice }) => updateNotice(boardNo, notice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] });
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
};

/** 공지 삭제 */
export const useDeleteNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardNo) => deleteNotice(boardNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] });
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
};
