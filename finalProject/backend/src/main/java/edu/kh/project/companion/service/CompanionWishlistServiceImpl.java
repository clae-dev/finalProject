package edu.kh.project.companion.service;

import edu.kh.project.companion.mapper.CompanionWishlistMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanionWishlistServiceImpl implements CompanionWishlistService {

    private final CompanionWishlistMapper mapper;

    @Override
    public Map<String, Object> toggleWishlist(int companionNo, int memberNo) {
        Map<String, Object> result = new HashMap<>();
        int exists = mapper.checkWishlist(companionNo, memberNo);
        if (exists > 0) {
            mapper.deleteWishlist(companionNo, memberNo);
            result.put("wishlisted", false);
        } else {
            mapper.insertWishlist(companionNo, memberNo);
            result.put("wishlisted", true);
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkWishlist(int companionNo, int memberNo) {
        return mapper.checkWishlist(companionNo, memberNo) > 0;
    }
}
