package edu.kh.project.member.service;

import edu.kh.project.member.dto.MemberVerificationDTO;
import edu.kh.project.member.mapper.MemberVerificationMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

/**
 * 회원 인증서류 서비스 구현체
 *
 * <p>인증서류 파일 업로드(UUID 기반), DB 삽입, 상태 조회 등
 * 인증 관련 비즈니스 로직을 구현한다.</p>
 *
 * @author HONDI
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MemberVerificationServiceImpl implements MemberVerificationService {

    private final MemberVerificationMapper verificationMapper;

    @Override
    public int submitVerification(int memberNo, MultipartFile file, String webPath, String folderPath) {

        // 저장 폴더 생성
        File folder = new File(folderPath);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        // 고유 파일명 생성
        String originalName = file.getOriginalFilename();
        String ext = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".png";
        String renamedName = UUID.randomUUID().toString() + ext;

        try {
            file.transferTo(new File(folderPath + renamedName));
        } catch (Exception e) {
            log.error("인증서류 파일 저장 실패", e);
            throw new RuntimeException("파일 저장 실패", e);
        }

        MemberVerificationDTO dto = MemberVerificationDTO.builder()
                .memberNo(memberNo)
                .verificationFile(webPath + renamedName)
                .originalName(originalName)
                .renamedName(renamedName)
                .build();

        return verificationMapper.insertVerification(dto);
    }

    @Override
    @Transactional(readOnly = true)
    public MemberVerificationDTO getVerificationStatus(int memberNo) {
        return verificationMapper.selectLatestByMemberNo(memberNo);
    }
}
