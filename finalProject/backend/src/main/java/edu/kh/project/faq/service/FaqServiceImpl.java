package edu.kh.project.faq.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.faq.dto.FaqCategoryDTO;
import edu.kh.project.faq.dto.FaqDTO;
import edu.kh.project.faq.mapper.FaqMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * FAQ 서비스 구현체
 *
 * <p>FAQ 카테고리별 목록 조회, CRUD 등
 * 자주 묻는 질문 관련 비즈니스 로직을 구현한다.</p>
 *
 * @author HONDI
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class FaqServiceImpl implements FaqService {

    private final FaqMapper faqMapper;

    @Override
    @Transactional(readOnly = true)
    public List<FaqCategoryDTO> getCategoryList() {
        return faqMapper.selectCategoryList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FaqDTO> getFaqList(String categoryCode, String search) {
        return faqMapper.selectFaqList(categoryCode, search);
    }

    @Override
    public int increaseViewCount(int faqNo) {
        return faqMapper.updateViewCount(faqNo);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FaqDTO> getAdminFaqList(int page, int size, String search) {
        int offset = (page - 1) * size;
        return faqMapper.selectAdminFaqList(offset, size, search);
    }

    @Override
    @Transactional(readOnly = true)
    public int getAdminFaqCount(String search) {
        return faqMapper.selectAdminFaqCount(search);
    }

    @Override
    public int createFaq(FaqDTO faq) {
        return faqMapper.insertFaq(faq);
    }

    @Override
    public int updateFaq(FaqDTO faq) {
        return faqMapper.updateFaq(faq);
    }

    @Override
    public int deleteFaq(int faqNo) {
        return faqMapper.softDeleteFaq(faqNo);
    }
}
