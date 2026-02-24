import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createInquiry,
  getMyInquiries,
  getInquiryDetail,
  deleteInquiry,
  getAdminInquiries,
  getAdminInquiryDetail,
  answerInquiry,
  deleteAdminInquiry,
} from './inquiryAPI';
import type { Inquiry } from '../../types';

/** 내 문의 목록 */
export const useMyInquiries = (page = 1, size = 10) => {
  return useQuery({
    queryKey: ['inquiry', 'my', page, size],
    queryFn: () => getMyInquiries(page, size),
  });
};

/** 문의 상세 (사용자) */
export const useInquiryDetail = (inquiryNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['inquiry', inquiryNo],
    queryFn: () => getInquiryDetail(inquiryNo!),
    enabled: !!inquiryNo,
  });
};

/** 문의 등록 */
export const useCreateInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inquiry: Partial<Inquiry>) => createInquiry(inquiry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiry', 'my'] });
    },
  });
};

/** 문의 삭제 (사용자) */
export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inquiryNo: number | string) => deleteInquiry(inquiryNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiry', 'my'] });
    },
  });
};

/** 관리자 문의 목록 */
export const useAdminInquiries = (page = 1, size = 10, status = '') => {
  return useQuery({
    queryKey: ['admin', 'inquiry', page, size, status],
    queryFn: () => getAdminInquiries(page, size, status),
  });
};

/** 관리자 문의 상세 */
export const useAdminInquiryDetail = (inquiryNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['admin', 'inquiry', 'detail', inquiryNo],
    queryFn: () => getAdminInquiryDetail(inquiryNo!),
    enabled: !!inquiryNo,
  });
};

/** 관리자 답변 등록 */
export const useAnswerInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ inquiryNo, answer }: { inquiryNo: number | string; answer: string }) =>
      answerInquiry(inquiryNo, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inquiry'] });
    },
  });
};

/** 관리자 문의 삭제 */
export const useDeleteAdminInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inquiryNo: number | string) => deleteAdminInquiry(inquiryNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inquiry'] });
    },
  });
};
