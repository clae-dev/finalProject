package edu.kh.project.notification.dto;

import lombok.*;

/**
 * 알림 DTO
 *
 * <p>NOTIFICATION 테이블과 매핑되는 알림 데이터 객체.
 * REST API 응답과 WebSocket 실시간 알림 전송 양쪽에서 사용한다.
 * 알림 유형(COMPANION_JOIN, COMPANION_ACCEPTED 등), 대상, 발신자 정보를 포함한다.</p>
 *
 * @author HONDI
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class NotificationDTO {

    /** 알림 번호 (PK) */
    private int notificationNo;
    /** 수신자 회원 번호 (FK → MEMBER) */
    private int recipientNo;
    /** 발신자 회원 번호 (FK → MEMBER) */
    private int senderNo;
    /** 알림 유형 (COMPANION_JOIN, COMPANION_ACCEPTED 등) */
    private String notificationType;
    /** 대상 유형 (COMPANION 등) */
    private String targetType;
    /** 대상 번호 (동행 게시글 번호 등) */
    private int targetNo;
    /** 알림 제목 */
    private String title;
    /** 알림 내용 */
    private String content;
    /** 읽음 여부 (Y/N) */
    private String readFl;
    /** 상태 (A:활성, D:삭제) */
    private String status;
    /** 생성일 */
    private String createdAt;

    // ==================== JOIN 파생 필드 ====================

    /** 발신자 닉네임 */
    private String senderNickname;
    /** 발신자 프로필 이미지 */
    private String senderProfileImg;
}
