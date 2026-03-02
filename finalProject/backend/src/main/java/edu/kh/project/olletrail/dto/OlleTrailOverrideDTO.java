package edu.kh.project.olletrail.dto;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 올레길 코스 수정 데이터 DTO
 * GPS 경로(path)·스탬프는 정적 파일 유지, 텍스트 필드만 DB 저장
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class OlleTrailOverrideDTO {

    private int    trailId;       // 올레길 코스 id (olleTrails.js 기준)
    private String subtitle;      // 구간 (시흥초등학교 → 광치기해변)
    private String description;   // 코스 소개 텍스트
    private String difficulty;    // 난이도: 하/중/상
    private String duration;      // 소요시간 (예: 5~6시간)
    private String terrain;       // 지형 (예: 해안·오름)
    private Double distance;      // 거리 (km)

    private LocalDateTime updatedAt;
    private Integer updatedBy;    // 수정한 관리자 memberNo
}
