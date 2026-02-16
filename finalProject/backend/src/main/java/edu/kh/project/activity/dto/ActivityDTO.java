package edu.kh.project.activity.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ActivityDTO {

    private int boardNo;
    private int memberNo;
    private int boardTypeNo;
    private String boardTitle;
    private String boardContent;
    private int readCount;
    private String boardDelFl;
    private String createdAt;
    private String updatedAt;

    // JOIN 파생 필드
    private String memberNickname;
    private String memberProfile;

    // 집계 필드
    private int commentCount;
    private int likeCount;
    private int isLiked;

    // 이미지 (LISTAGG 또는 별도 조회)
    private String imageUrls;

    // 이미지 목록 (서비스에서 분리)
    private List<String> imageList;
}
