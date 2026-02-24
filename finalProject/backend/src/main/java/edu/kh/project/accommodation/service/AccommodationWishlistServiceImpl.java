package edu.kh.project.accommodation.service;

import edu.kh.project.accommodation.mapper.AccommodationWishlistMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AccommodationWishlistServiceImpl implements AccommodationWishlistService {

    private final AccommodationWishlistMapper mapper;

    @Override
    public Map<String, Object> toggleWishlist(int accommodationNo, int memberNo) {
        Map<String, Object> result = new HashMap<>();
        int exists = mapper.checkWishlist(accommodationNo, memberNo);
        if (exists > 0) {
            mapper.deleteWishlist(accommodationNo, memberNo);
            result.put("wishlisted", false);
        } else {
            mapper.insertWishlist(accommodationNo, memberNo);
            result.put("wishlisted", true);
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkWishlist(int accommodationNo, int memberNo) {
        return mapper.checkWishlist(accommodationNo, memberNo) > 0;
    }
}
