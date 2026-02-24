package edu.kh.project.companion.service;

import java.util.Map;

public interface CompanionWishlistService {
    Map<String, Object> toggleWishlist(int companionNo, int memberNo);
    boolean checkWishlist(int companionNo, int memberNo);
}
