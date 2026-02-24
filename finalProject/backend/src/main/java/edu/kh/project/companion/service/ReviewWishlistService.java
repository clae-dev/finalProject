package edu.kh.project.companion.service;

import java.util.Map;

public interface ReviewWishlistService {
    Map<String, Object> toggleWishlist(int reviewNo, int memberNo);
    boolean checkWishlist(int reviewNo, int memberNo);
}
