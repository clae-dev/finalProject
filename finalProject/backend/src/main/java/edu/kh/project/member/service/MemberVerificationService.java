package edu.kh.project.member.service;

import edu.kh.project.member.dto.MemberVerificationDTO;
import org.springframework.web.multipart.MultipartFile;

public interface MemberVerificationService {

    int submitVerification(int memberNo, MultipartFile file, String webPath, String folderPath);

    MemberVerificationDTO getVerificationStatus(int memberNo);
}
