package edu.kh.project.accommodation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * 숙소 정보 DTO
 * - ACCOMMODATION 테이블과 매핑
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccommodationDTO {
    
    // 기본 정보
    private Long accommodationNo;           // PK
    private String tourApiId;               // API 관리번호 (TOUR_API_ID) - 중복 체크용
    private String name;                    // 숙소명
    private String address;                 // 도로명주소
    private String phone;                   // 전화번호
    
    // 가격 정보
    private Integer priceMin;               // 최소 가격
    private Integer priceMax;               // 최대 가격
    
    // 운영 정보
    private String checkInTime;             // 체크인 시간
    private String checkOutTime;            // 체크아웃 시간
    private String facilities;              // 편의시설
    
    // 분류 정보
    private String accommodationType;       // 숙소 유형
    private String region;                  // 지역 (제주시/서귀포시)
    
    // 위치 정보
    private Double latitude;                // 위도
    private Double longitude;               // 경도
    
    // 관리자 입력 정보
    private String recommendationReason;    // 혼행 추천 이유
    private String thumbnailUrl;            // 썸네일 URL
    
    // 통계 정보
    private Integer viewCount;              // 조회수
    
    // 상태 정보
    private String status;                  // 상태 (A:활성, C:폐업)
    private LocalDateTime createdAt;        // 등록일시
    private LocalDateTime updatedAt;        // 수정일시
}