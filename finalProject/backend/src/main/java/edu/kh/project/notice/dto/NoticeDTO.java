package edu.kh.project.notice.dto;

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
public class NoticeDTO {

    private int boardNo;
    private String boardTitle;
    private String boardContent;
    private int readCount;
    private String boardDelFl;
    private int memberNo;
    private int boardTypeNo;
    private String createdAt;
    private String updatedAt;

    // JOIN 파생 필드
    private String memberNickname;
}
