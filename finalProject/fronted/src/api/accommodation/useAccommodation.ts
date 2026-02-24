import { useQuery } from '@tanstack/react-query';
import { getAccommodationList, getAccommodationDetail } from './accommodationAPI';

/**
 * 숙소 목록 조회 훅
 * @param page - 페이지 번호
 * @param size - 페이지 크기
 * @param region - 지역 필터 (null = 전체)
 */
export const useAccommodations = (page = 1, size = 9, region: string | null = null) => {
  return useQuery({
    queryKey: ['accommodations', page, size, region],
    queryFn: () => getAccommodationList(page, size, region),
  });
};

/**
 * 숙소 상세 조회 훅
 * @param accommodationNo - 숙소 번호
 */
export const useAccommodationDetail = (accommodationNo: number | string | undefined) => {
  return useQuery({
    queryKey: ['accommodation', accommodationNo],
    queryFn: () => getAccommodationDetail(accommodationNo!),
    enabled: !!accommodationNo,
  });
};
