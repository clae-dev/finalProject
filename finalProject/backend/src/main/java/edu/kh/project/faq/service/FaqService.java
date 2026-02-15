package edu.kh.project.faq.service;

import java.util.List;

import edu.kh.project.faq.dto.FaqCategoryDTO;
import edu.kh.project.faq.dto.FaqDTO;

public interface FaqService {

    /** 카테고리 목록 조회 */
    List<FaqCategoryDTO> getCategoryList();

    /** FAQ 전체 조회 (사용자용) */
    List<FaqDTO> getFaqList(String categoryCode, String search);

    /** 조회수 증가 */
    int increaseViewCount(int faqNo);

    /** FAQ 목록 (관리자용, 페이징) */
    List<FaqDTO> getAdminFaqList(int page, int size, String search);

    /** FAQ 총 개수 (관리자용) */
    int getAdminFaqCount(String search);

    /** FAQ 등록 */
    int createFaq(FaqDTO faq);

    /** FAQ 수정 */
    int updateFaq(FaqDTO faq);

    /** FAQ 소프트 삭제 */
    int deleteFaq(int faqNo);
}
