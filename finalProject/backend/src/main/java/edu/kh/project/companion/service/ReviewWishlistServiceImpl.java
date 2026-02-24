package edu.kh.project.companion.service;

import edu.kh.project.companion.mapper.ReviewWishlistMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewWishlistServiceImpl implements ReviewWishlistService {

    private final ReviewWishlistMapper mapper;

    @Override
    public Map<String, Object> toggleWishlist(int reviewNo, int memberNo) {
        Map<String, Object> result = new HashMap<>();
        int exists = mapper.checkWishlist(reviewNo, memberNo);
        if (exists > 0) {
            mapper.deleteWishlist(reviewNo, memberNo);
            result.put("wishlisted", false);
        } else {
            mapper.insertWishlist(reviewNo, memberNo);
            result.put("wishlisted", true);
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkWishlist(int reviewNo, int memberNo) {
        return mapper.checkWishlist(reviewNo, memberNo) > 0;
    }
}
