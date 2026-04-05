package edu.kh.project.chatting.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.project.chatting.dto.ChattingRoomDTO;
import edu.kh.project.chatting.dto.MessageDTO;

/**
 * 채팅 MyBatis Mapper
 *
 * <p>CHATTING_ROOM, MESSAGE 테이블에 대한 SQL 매핑 인터페이스.
 * 채팅방 CRUD, 메시지 저장/조회, 읽음 처리 쿼리를 정의한다.</p>
 *
 * @author HONDI
 */
@Mapper
public interface ChattingMapper {

    /** 채팅방 목록 조회 */
    List<ChattingRoomDTO> selectRoomList(@Param("memberNo") int memberNo);

    /** 대화 상대 검색 */
    List<Map<String, Object>> searchTarget(@Param("query") String query,
                                           @Param("memberNo") int memberNo);

    /** 기존 채팅방 존재 여부 조회 */
    Integer selectExistRoom(@Param("memberNo") int memberNo,
                            @Param("targetNo") int targetNo);

    /** 채팅방 생성 */
    int insertChattingRoom(@Param("memberNo") int memberNo,
                           @Param("targetNo") int targetNo);

    /** 메시지 목록 조회 (커서 기반 페이징) */
    List<MessageDTO> selectMessageList(@Param("chattingRoomNo") int chattingRoomNo,
                                       @Param("beforeMessageNo") Integer beforeMessageNo,
                                       @Param("limit") int limit);

    /** 메시지 저장 */
    int insertMessage(MessageDTO msg);

    /** 읽음 처리 */
    int updateReadFlag(@Param("chattingRoomNo") int chattingRoomNo,
                       @Param("memberNo") int memberNo);
}
