package edu.kh.project.notification.mapper;

import edu.kh.project.notification.dto.NotificationDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 알림 MyBatis Mapper
 *
 * <p>NOTIFICATION 테이블에 대한 SQL 매핑 인터페이스.
 * 알림 등록, 목록/건수 조회, 읽음 처리, 삭제 쿼리를 정의한다.</p>
 *
 * @author HONDI
 */
@Mapper
public interface NotificationMapper {

    /** 알림 등록 */
    int insert(NotificationDTO notification);

    /** 알림 목록 조회 (페이징) */
    List<NotificationDTO> selectList(
        @Param("recipientNo") int recipientNo,
        @Param("offset") int offset,
        @Param("limit") int limit
    );

    /** 알림 총 수 */
    int selectCount(@Param("recipientNo") int recipientNo);

    /** 읽지 않은 알림 수 */
    int selectUnreadCount(@Param("recipientNo") int recipientNo);

    /** 알림 읽음 처리 (단건) */
    int updateReadFlag(
        @Param("notificationNo") int notificationNo,
        @Param("recipientNo") int recipientNo
    );

    /** 알림 전체 읽음 처리 */
    int updateAllReadFlag(@Param("recipientNo") int recipientNo);

    /** 알림 삭제 */
    int deleteNotification(
        @Param("notificationNo") int notificationNo,
        @Param("recipientNo") int recipientNo
    );
}
