package edu.kh.project.notification.mapper;

import edu.kh.project.notification.dto.NotificationDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NotificationMapper {

    int insert(NotificationDTO notification);

    List<NotificationDTO> selectList(
        @Param("recipientNo") int recipientNo,
        @Param("offset") int offset,
        @Param("limit") int limit
    );

    int selectCount(@Param("recipientNo") int recipientNo);

    int selectUnreadCount(@Param("recipientNo") int recipientNo);

    int updateReadFlag(
        @Param("notificationNo") int notificationNo,
        @Param("recipientNo") int recipientNo
    );

    int updateAllReadFlag(@Param("recipientNo") int recipientNo);

    int deleteNotification(
        @Param("notificationNo") int notificationNo,
        @Param("recipientNo") int recipientNo
    );
}
