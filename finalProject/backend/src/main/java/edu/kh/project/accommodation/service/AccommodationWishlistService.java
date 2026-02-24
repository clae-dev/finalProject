package edu.kh.project.accommodation.service;

import java.util.Map;

public interface AccommodationWishlistService {
    Map<String, Object> toggleWishlist(int accommodationNo, int memberNo);
    boolean checkWishlist(int accommodationNo, int memberNo);
}
