package edu.kh.project.faq.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.project.faq.dto.FaqCategoryDTO;
import edu.kh.project.faq.dto.FaqDTO;

/**
 * FAQ MyBatis Mapper
 *
 * <p>FAQ, FAQ_CATEGORY 테이블에 대한 SQL 매핑 인터페이스.
 * FAQ CRUD, 카테고리 조회, 조회수 증가 쿼리를 정의한다.</p>
 *
 * @author HONDI
 */
@Mapper
public interface FaqMapper {

    /** 카테고리 목록 조회 */
    List<FaqCategoryDTO> selectCategoryList();

    /** FAQ 전체 조회 (사용자용, 활성 상태만) */
    List<FaqDTO> selectFaqList(@Param("categoryCode") String categoryCode,
                               @Param("search") String search);

    /** 조회수 증가 */
    int updateViewCount(@Param("faqNo") int faqNo);

    /** FAQ 목록 (관리자용, 페이징 + 검색) */
    List<FaqDTO> selectAdminFaqList(@Param("offset") int offset,
                                    @Param("limit") int limit,
                                    @Param("search") String search);

    /** FAQ 총 개수 (관리자용) */
    int selectAdminFaqCount(@Param("search") String search);

    /** FAQ 등록 */
    int insertFaq(FaqDTO faq);

    /** FAQ 수정 */
    int updateFaq(FaqDTO faq);

    /** FAQ 소프트 삭제 */
    int softDeleteFaq(@Param("faqNo") int faqNo);
}
