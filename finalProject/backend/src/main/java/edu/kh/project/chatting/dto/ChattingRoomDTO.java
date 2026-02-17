package edu.kh.project.chatting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 채팅방 DTO
 * - CHATTING_ROOM 테이블과 매핑
 * - 채팅 목록 조회 시 사용
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ChattingRoomDTO {

    private int chattingRoomNo;    // 채팅방 번호 (PK)
    private String lastMessage;    // 마지막 메시지 내용
    private String sendTime;       // 마지막 메시지 전송 시간
    private int targetNo;          // 상대방 회원 번호
    private String targetNickName; // 상대방 닉네임
    private String targetProfile;  // 상대방 프로필 이미지
    private int notReadCount;      // 읽지 않은 메시지 수
}
