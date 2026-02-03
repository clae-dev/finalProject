package edu.kh.project.spot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

/**
 * 제주 명소 DTO
 * - 메인 페이지 명소 갤러리용
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SpotDTO {

    private int spotNo;              // 명소 번호 (PK)
    private String spotTitle;        // 제목
    private String spotDesc;         // 설명
    private String spotLocation;     // 위치
    private String spotImage;        // 이미지 URL
    private String spotTag;          // 태그 (UNESCO 등)
    private int spotOrder;           // 정렬 순서
    private String spotSize;         // 크기 (large, small)
    private String spotStatus;       // 상태 (ACTIVE, INACTIVE)
    private LocalDateTime createdAt; // 등록일
    private LocalDateTime updatedAt; // 수정일
}
