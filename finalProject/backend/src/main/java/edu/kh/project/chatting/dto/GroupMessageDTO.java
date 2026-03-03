package edu.kh.project.chatting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 그룹 채팅 메시지 DTO
 *
 * <p>GROUP_MESSAGE 테이블과 매핑되는 메시지 데이터 객체.
 * WebSocket 전송 시 isGroupMessage=true 플래그로 1:1 메시지와 구분한다.</p>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class GroupMessageDTO {

    /** 그룹 메시지 번호 (PK) */
    private int groupMsgNo;

    /** 그룹 채팅방 번호 */
    private int groupRoomNo;

    /** 발신자 회원 번호 */
    private int senderNo;

    /** 발신자 닉네임 (JOIN 파생) */
    private String senderNickname;

    /** 발신자 프로필 이미지 (JOIN 파생) */
    private String senderProfile;

    /** 메시지 내용 */
    private String msgContent;

    /** 전송 시간 */
    private String sendTime;

    /** 그룹 메시지 여부 — WebSocket 라우팅용 플래그 */
    @Builder.Default
    @JsonProperty("isGroupMessage")
    private boolean groupMessage = true;
}
