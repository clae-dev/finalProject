package edu.kh.project.notification.dto;

import lombok.*;

/**
 * 알림 DTO
 * - NOTIFICATION 테이블과 매핑
 * - 실시간 WebSocket 알림 전송 시에도 사용
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class NotificationDTO {

    private int notificationNo;      // 알림 번호 (PK)
    private int recipientNo;         // 수신자 회원 번호 (FK)
    private int senderNo;            // 발신자 회원 번호 (FK)
    private String notificationType; // 알림 유형 (COMPANION_JOIN, COMPANION_ACCEPTED 등)
    private String targetType;       // 대상 유형 (COMPANION 등)
    private int targetNo;            // 대상 번호 (동행 게시글 번호 등)
    private String title;            // 알림 제목
    private String content;          // 알림 내용
    private String readFl;           // 읽음 여부 (Y/N)
    private String status;           // 상태 (A:활성, D:삭제)
    private String createdAt;        // 생성일

    // JOIN 파생 필드 (발신자 정보)
    private String senderNickname;   // 발신자 닉네임
    private String senderProfileImg; // 발신자 프로필 이미지
}
