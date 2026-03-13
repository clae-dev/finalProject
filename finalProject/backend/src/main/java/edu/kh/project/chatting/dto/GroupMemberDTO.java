package edu.kh.project.chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 그룹 채팅 멤버 DTO
 *
 * <p>GROUP_CHAT_MEMBER 테이블 + MEMBER JOIN 결과 매핑 객체.</p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class GroupMemberDTO {

    /** 회원 번호 */
    private int memberNo;

    /** 닉네임 */
    private String nickname;

    /** 프로필 이미지 URL */
    private String profileImage;
}
