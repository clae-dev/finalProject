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
 *
 * <p>메인 페이지 명소 갤러리 및 관리자 명소 관리에 사용되는 데이터 전송 객체이다.</p>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SpotDTO {

    /** 명소 번호 (PK) */
    private int spotNo;
    /** 제목 */
    private String spotTitle;
    /** 설명 */
    private String spotDesc;
    /** 위치 */
    private String spotLocation;
    /** 이미지 URL */
    private String spotImage;
    /** 태그 (UNESCO 등) */
    private String spotTag;
    /** 정렬 순서 */
    private int spotOrder;
    /** 크기 (large, small) */
    private String spotSize;
    /** 상태 (ACTIVE, INACTIVE) */
    private String spotStatus;
    /** 등록일 */
    private LocalDateTime createdAt;
    /** 수정일 */
    private LocalDateTime updatedAt;
}
