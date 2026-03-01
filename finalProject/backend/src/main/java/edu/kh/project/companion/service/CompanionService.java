package edu.kh.project.companion.service;

import edu.kh.project.companion.dto.CompanionDTO;
import edu.kh.project.companion.dto.CompanionJoinDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 동행 모집 서비스 인터페이스
 *
 * <p>동행 모집 게시글의 CRUD 및 참여 관리 비즈니스 로직을 정의한다.</p>
 *
 * @author HONDI
 */
public interface CompanionService {

    /**
     * 동행 목록을 페이징 조회한다.
     *
     * @param page 현재 페이지 번호
     * @param size 페이지당 게시글 수
     * @param tag  필터링할 태그 (null이면 전체 조회)
     * @return 동행 게시글 목록
     */
    List<CompanionDTO> getCompanionList(int page, int size, String tag);

    /**
     * 동행 게시글 총 건수를 조회한다.
     *
     * @param tag 필터링할 태그 (null이면 전체)
     * @return 총 게시글 수
     */
    int getCompanionCount(String tag);

    /**
     * 동행 게시글 상세 정보를 조회한다.
     *
     * @param companionNo 동행 게시글 번호
     * @return 동행 상세 정보 (없으면 null)
     */
    CompanionDTO getCompanionDetail(int companionNo);

    /**
     * 동행 참여 신청 목록을 조회한다.
     *
     * @param companionNo 동행 게시글 번호
     * @return 참여 신청 목록
     */
    List<CompanionJoinDTO> getJoinList(int companionNo);

    /**
     * 동행 게시글을 작성한다 (이미지 업로드 포함).
     *
     * @param companion     동행 게시글 데이터
     * @param thumbnail     썸네일 이미지 파일
     * @param contentImages 본문 이미지 파일 목록
     * @param webPath       이미지 웹 접근 경로
     * @param folderPath    이미지 서버 물리 경로
     * @return 삽입된 행 수
     */
    int createCompanion(CompanionDTO companion, MultipartFile thumbnail,
                        List<MultipartFile> contentImages,
                        String webPath, String folderPath);

    /**
     * 동행 게시글을 수정한다 (작성자만 가능).
     *
     * @param companion  수정할 동행 데이터 (companionNo, memberNo 포함)
     * @param keepImages 기존에 유지할 이미지 URL (쉼표 구분 문자열)
     * @param newImages  새로 추가할 이미지 파일 목록
     * @param webPath    이미지 웹 접근 경로
     * @param folderPath 이미지 서버 물리 경로
     * @return 수정된 행 수 (권한 없으면 0)
     */
    int updateCompanion(CompanionDTO companion, String keepImages,
                        List<MultipartFile> newImages,
                        String webPath, String folderPath);

    /**
     * 동행 게시글을 삭제한다 (작성자만 가능).
     *
     * @param companionNo 동행 게시글 번호
     * @param memberNo    요청한 회원 번호
     * @return 삭제된 행 수 (권한 없으면 0)
     */
    int deleteCompanion(int companionNo, int memberNo);

    /**
     * 동행에 참여를 신청한다.
     *
     * @param companionNo 동행 게시글 번호
     * @param memberNo    신청하는 회원 번호
     * @return 삽입된 행 수 (중복 신청이면 -1)
     */
    int joinCompanion(int companionNo, int memberNo);

    /**
     * 동행 참여 신청을 취소한다.
     *
     * @param companionNo 동행 게시글 번호
     * @param memberNo    취소하는 회원 번호
     * @return 삭제된 행 수
     */
    int cancelJoin(int companionNo, int memberNo);

    /**
     * 참여 신청 상태를 변경한다 (승인/거절, 작성자만 가능).
     *
     * @param joinNo   참가 신청 번호
     * @param status   변경할 상태 ("A"=수락, "C"=거절)
     * @param memberNo 게시글 작성자 번호
     * @return 수정된 행 수 (권한 없으면 0)
     */
    int updateJoinStatus(int joinNo, String status, int memberNo);
}
