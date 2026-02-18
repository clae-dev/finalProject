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
    
    private Long accommodationNo;
    /** TourAPI 관리번호 -- 중복 체크용 */
    private String tourApiId;
    private String name;
    private String address;
    private String phone;

    private Integer priceMin;
    private Integer priceMax;

    private String checkInTime;
    private String checkOutTime;
    private String facilities;

    private String accommodationType;
    /** 지역 (제주시/서귀포시) */
    private String region;

    private Double latitude;
    private Double longitude;

    private String recommendationReason;
    private String thumbnailUrl;

    private Integer viewCount;

    /** 상태 (A:활성, C:폐업) */
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Double avgRating;
    private Integer reviewCount;

    /** LISTAGG 결과 (JSON에 포함 안됨) */
    @JsonIgnore
    private String imageUrlsRaw;
    /** 파싱된 이미지 URL 리스트 (프론트에 전달) */
    private List<String> imageUrls;
}