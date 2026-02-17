package edu.kh.project.accommodation.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 숙소 정보 DTO
 *
 * <p>ACCOMMODATION 테이블과 매핑되는 숙소 데이터 객체.
 * TourAPI에서 동기화된 기본 정보, 가격, 운영, 분류, 위치, 통계, 이미지 정보를 포함한다.</p>
 *
 * @author HONDI
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccommodationDTO {
    
    // ==================== 기본 정보 ====================

    /** 숙소 번호 (PK) */
    private Long accommodationNo;
    /** TourAPI 관리번호 – 중복 체크용 */
    private String tourApiId;
    /** 숙소명 */
    private String name;
    /** 도로명주소 */
    private String address;
    /** 전화번호 */
    private String phone;

    // ==================== 가격 정보 ====================

    /** 최소 가격 */
    private Integer priceMin;
    /** 최대 가격 */
    private Integer priceMax;

    // ==================== 운영 정보 ====================

    /** 체크인 시간 */
    private String checkInTime;
    /** 체크아웃 시간 */
    private String checkOutTime;
    /** 편의시설 */
    private String facilities;

    // ==================== 분류 정보 ====================

    /** 숙소 유형 */
    private String accommodationType;
    /** 지역 (제주시/서귀포시) */
    private String region;

    // ==================== 위치 정보 ====================

    /** 위도 */
    private Double latitude;
    /** 경도 */
    private Double longitude;

    // ==================== 관리자 입력 정보 ====================

    /** 혼행 추천 이유 */
    private String recommendationReason;
    /** 썸네일 URL */
    private String thumbnailUrl;

    // ==================== 통계 정보 ====================

    /** 조회수 */
    private Integer viewCount;

    // ==================== 상태 정보 ====================

    /** 상태 (A:활성, C:폐업) */
    private String status;
    /** 등록일시 */
    private LocalDateTime createdAt;
    /** 수정일시 */
    private LocalDateTime updatedAt;

    // ==================== 후기 통계 ====================

    /** 평균 별점 */
    private Double avgRating;
    /** 후기 수 */
    private Integer reviewCount;

    // ==================== 이미지 정보 ====================

    /** LISTAGG 결과 (JSON에 포함 안됨) */
    @JsonIgnore
    private String imageUrlsRaw;
    /** 파싱된 이미지 URL 리스트 (프론트에 전달) */
    private List<String> imageUrls;
}