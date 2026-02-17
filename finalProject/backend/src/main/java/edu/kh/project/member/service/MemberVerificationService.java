package edu.kh.project.member.service;

import edu.kh.project.member.dto.MemberVerificationDTO;
import org.springframework.web.multipart.MultipartFile;

/**
 * 회원 인증서류 서비스 인터페이스
 *
 * <p>인증 리뷰어 뱃지 발급을 위한 인증서류 제출 및 상태 조회
 * 비즈니스 로직을 정의한다.</p>
 *
 * @author HONDI
 * @see MemberVerificationServiceImpl
 */
public interface MemberVerificationService {

    /**
     * 인증서류를 제출한다.
     *
     * <p>파일을 UUID 기반 고유명으로 서버에 저장하고,
     * DB에 인증 신청 기록을 삽입한다. 초기 상태는 'W'(대기).</p>
     *
     * @param memberNo   신청 회원 번호
     * @param file       인증서류 파일 (이미지)
     * @param webPath    파일 웹 접근 경로
     * @param folderPath 파일 서버 저장 경로
     * @return 삽입된 행 수
     */
    int submitVerification(int memberNo, MultipartFile file, String webPath, String folderPath);

    /**
     * 회원의 최신 인증서류 상태를 조회한다.
     *
     * @param memberNo 조회할 회원 번호
     * @return 인증서류 상태 DTO (없으면 null)
     */
    MemberVerificationDTO getVerificationStatus(int memberNo);
}
