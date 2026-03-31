package edu.kh.project.member.controller;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.Period;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.member.dto.LoginRequestDTO;
import edu.kh.project.member.dto.LoginResponseDTO;
import edu.kh.project.member.dto.MemberDTO;
import edu.kh.project.member.dto.MemberVerificationDTO;
import edu.kh.project.member.dto.RefreshRequestDTO;
import edu.kh.project.member.dto.SignupRequestDTO;
import edu.kh.project.member.service.MemberService;
import edu.kh.project.member.service.MemberVerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 회원 REST API 컨트롤러
 *
 * <p>회원 가입, 로그인, 정보 수정 등 회원 관련 전체 API를 처리한다.</p>
 *
 * <h3>주요 엔드포인트</h3>
 * <ul>
 *   <li>POST /api/member/signup - 회원가입</li>
 *   <li>POST /api/member/login - 로그인 (JWT 발급)</li>
 *   <li>POST /api/member/refresh - Access Token 갱신</li>
 *   <li>GET  /api/member/info - 회원 정보 조회</li>
 *   <li>PUT  /api/member/info - 회원 정보 수정</li>
 *   <li>PUT  /api/member/password - 비밀번호 변경</li>
 *   <li>DELETE /api/member - 회원 탈퇴</li>
 *   <li>POST /api/member/verification - 인증서류 제출</li>
 *   <li>POST /api/member/profile-image - 프로필 이미지 업로드</li>
 * </ul>
 *
 * @author HONDI
 */
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@PropertySource("classpath:/config.properties")
@Slf4j
public class MemberController {

    private final MemberService memberService;
    private final MemberVerificationService verificationService;
    private final JwtUtil jwtUtil;

    @Value("${profile.image.web-path}")
    private String profileWebPath;

    @Value("${profile.image.folder-path}")
    private String profileFolderPath;

    @Value("${verification.image.web-path}")
    private String verificationWebPath;

    @Value("${verification.image.folder-path}")
    private String verificationFolderPath;
    
    /**
     * 이메일 중복 확인
     * @param memberEmail
     * @return 사용 가능 여부
     */
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Object>> checkEmail(
            @RequestParam("memberEmail") String memberEmail) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            int count = memberService.checkEmail(memberEmail);
            
            if (count == 0) {
                response.put("success", true);
                response.put("message", "사용 가능한 이메일입니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "이미 사용 중인 이메일입니다.");
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            log.error("이메일 중복 확인 실패", e);
            response.put("success", false);
            response.put("message", "이메일 중복 확인 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 닉네임 중복 확인
     * @param memberNickname
     * @param memberNo 본인 회원번호 (전달 시 본인 제외 중복 체크)
     * @return 사용 가능 여부
     */
    @GetMapping("/check-nickname")
    public ResponseEntity<Map<String, Object>> checkNickname(
            @RequestParam("memberNickname") String memberNickname,
            @RequestParam(value = "memberNo", required = false) Integer memberNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int count = memberService.checkNickname(memberNickname, memberNo);

            if (count == 0) {
                response.put("success", true);
                response.put("message", "사용 가능한 닉네임입니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "이미 사용 중인 닉네임입니다.");
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            log.error("닉네임 중복 확인 실패", e);
            response.put("success", false);
            response.put("message", "닉네임 중복 확인 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 회원가입
     * @param signupRequest
     * @return 회원가입 결과
     */
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(
            @RequestBody SignupRequestDTO signupRequest) {
        
        Map<String, Object> response = new HashMap<>();

        try {
            // 만 14세 미만 가입 차단 (서버측 검증)
            if (signupRequest.getMemberBirthDate() != null && !signupRequest.getMemberBirthDate().isEmpty()) {
                LocalDate birthDate = LocalDate.parse(signupRequest.getMemberBirthDate());
                int age = Period.between(birthDate, LocalDate.now()).getYears();
                if (age < 14) {
                    response.put("success", false);
                    response.put("message", "만 14세 미만은 가입할 수 없습니다.");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                }
            } else {
                response.put("success", false);
                response.put("message", "생년월일을 입력해주세요.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            int result = memberService.signup(signupRequest);

            if (result > 0) {
                response.put("success", true);
                response.put("message", "회원가입이 완료되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "회원가입에 실패했습니다.");
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            log.error("회원가입 실패", e);
            response.put("success", false);
            response.put("message", "회원가입 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 로그인
     * @param loginRequest
     * @return JWT 토큰 + 회원 정보
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody LoginRequestDTO loginRequest) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            LoginResponseDTO loginResponse = memberService.login(loginRequest);
            
            if (loginResponse != null) {
                response.put("success", true);
                response.put("message", "로그인에 성공했습니다.");
                response.put("data", loginResponse);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "이메일 또는 비밀번호가 일치하지 않습니다.");
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            log.error("로그인 실패", e);
            response.put("success", false);
            response.put("message", "로그인 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 토큰 갱신 (Refresh Token → 새 Access Token + Refresh Token)
     * @param refreshRequest
     * @return 새 JWT 토큰 + 회원 정보
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refresh(
            @RequestBody RefreshRequestDTO refreshRequest) {

        Map<String, Object> response = new HashMap<>();

        try {
            LoginResponseDTO loginResponse = memberService.refreshToken(refreshRequest.getRefreshToken());

            if (loginResponse != null) {
                response.put("success", true);
                response.put("message", "토큰이 갱신되었습니다.");
                response.put("data", loginResponse);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "토큰 갱신에 실패했습니다. 다시 로그인해주세요.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (Exception e) {
            log.error("토큰 갱신 실패", e);
            response.put("success", false);
            response.put("message", "토큰 갱신 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 회원 정보 조회
     * @param memberNo
     * @return 회원 정보
     */
    @GetMapping("/{memberNo}")
    public ResponseEntity<Map<String, Object>> getMember(
            @PathVariable("memberNo") int memberNo) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            MemberDTO member = memberService.getMemberWithStats(memberNo);

            if (member != null) {
                response.put("success", true);
                response.put("data", member);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "회원 정보를 찾을 수 없습니다.");
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            log.error("회원 정보 조회 실패", e);
            response.put("success", false);
            response.put("message", "회원 정보 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 회원 활동 내역 조회 (내 글, 내 후기, 좋아요)
     * @param memberNo
     * @return 활동 내역
     */
    @GetMapping("/{memberNo}/activity")
    public ResponseEntity<Map<String, Object>> getMyActivity(
            @PathVariable("memberNo") int memberNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> activity = memberService.getMyActivity(memberNo);
            response.put("success", true);
            response.put("data", activity);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("활동 내역 조회 실패", e);
            response.put("success", false);
            response.put("message", "활동 내역 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 아이디 찾기 (이름 + 이메일 인증)
     * @param memberName
     * @param memberEmail
     * @return 마스킹된 이메일 + 가입일
     */
    @PostMapping("/find-id")
    public ResponseEntity<Map<String, Object>> findId(
            @RequestParam("memberName") String memberName,
            @RequestParam("memberEmail") String memberEmail) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            MemberDTO member = memberService.findId(memberName, memberEmail);
            
            if (member != null) {
                // 이메일 마스킹 처리 (예: test*** @example.com)
                String email = member.getMemberEmail();
                String maskedEmail = maskEmail(email);
                
                response.put("success", true);
                response.put("message", "아이디를 찾았습니다.");
                response.put("email", maskedEmail);
                response.put("createdAt", member.getCreatedAt());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "일치하는 회원 정보를 찾을 수 없습니다.");
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            log.error("아이디 찾기 실패", e);
            response.put("success", false);
            response.put("message", "아이디 찾기 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 비밀번호 찾기 (아이디 + 이메일 인증)
     * @param memberEmail
     * @param memberName
     * @return 비밀번호 재설정 가능 여부
     */
    @PostMapping("/find-password")
    public ResponseEntity<Map<String, Object>> findPassword(
            @RequestParam("memberEmail") String memberEmail,
            @RequestParam("memberName") String memberName) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            MemberDTO member = memberService.findPw(memberEmail, memberName, memberEmail);
            
            if (member != null) {
                response.put("success", true);
                response.put("message", "회원 확인이 완료되었습니다. 비밀번호를 재설정해주세요.");
                response.put("memberEmail", member.getMemberEmail());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "일치하는 회원 정보를 찾을 수 없습니다.");
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            log.error("비밀번호 찾기 실패", e);
            response.put("success", false);
            response.put("message", "비밀번호 찾기 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 비밀번호 재설정
     * @param memberEmail
     * @param newPw
     * @return 재설정 결과
     */
    @PutMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @RequestParam("memberEmail") String memberEmail,
            @RequestParam("newPw") String newPw) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            int result = memberService.resetPw(memberEmail, newPw);
            
            if (result > 0) {
                response.put("success", true);
                response.put("message", "비밀번호가 재설정되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "비밀번호 재설정에 실패했습니다.");
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            log.error("비밀번호 재설정 실패", e);
            response.put("success", false);
            response.put("message", "비밀번호 재설정 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 비밀번호 변경 (로그인 상태에서 현재 비밀번호 확인 후 변경)
     */
    @PutMapping("/{memberNo}/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @PathVariable("memberNo") int memberNo,
            @RequestBody Map<String, String> body) {

        Map<String, Object> response = new HashMap<>();

        try {
            String currentPassword = body.get("currentPassword");
            String newPassword = body.get("newPassword");

            if (currentPassword == null || newPassword == null) {
                response.put("success", false);
                response.put("message", "현재 비밀번호와 새 비밀번호를 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            int result = memberService.changePassword(memberNo, currentPassword, newPassword);

            if (result > 0) {
                response.put("success", true);
                response.put("message", "비밀번호가 변경되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "현재 비밀번호가 일치하지 않습니다.");
                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            log.error("비밀번호 변경 실패", e);
            response.put("success", false);
            response.put("message", "비밀번호 변경 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 회원 정보 수정
     * @param memberNo
     * @param member
     * @return 수정 결과
     */
    @PutMapping("/{memberNo}")
    public ResponseEntity<Map<String, Object>> updateMember(
            @PathVariable("memberNo") int memberNo,
            @RequestBody MemberDTO member) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            member.setMemberNo(memberNo);
            int result = memberService.updateMember(member);
            
            if (result > 0) {
                response.put("success", true);
                response.put("message", "회원 정보가 수정되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "회원 정보 수정에 실패했습니다.");
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            log.error("회원 정보 수정 실패", e);
            response.put("success", false);
            response.put("message", "회원 정보 수정 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 회원 탈퇴
     * @param memberNo
     * @param memberPw
     * @return 탈퇴 결과
     */
    @DeleteMapping("/{memberNo}")
    public ResponseEntity<Map<String, Object>> withdrawMember(
            @PathVariable("memberNo") int memberNo,
            @RequestParam("memberPw") String memberPw) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            int result = memberService.withdrawMember(memberNo, memberPw);
            
            if (result > 0) {
                response.put("success", true);
                response.put("message", "회원 탈퇴가 완료되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "비밀번호가 일치하지 않거나 회원 탈퇴에 실패했습니다.");
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            log.error("회원 탈퇴 실패", e);
            response.put("success", false);
            response.put("message", "회원 탈퇴 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 프로필 이미지 업로드
     * @param profileImage 업로드할 이미지 파일
     * @return 이미지 웹 경로
     */
    @PostMapping("/profile-image")
    public ResponseEntity<Map<String, Object>> uploadProfileImage(
            @RequestParam("profileImage") MultipartFile profileImage) {

        Map<String, Object> response = new HashMap<>();

        try {
            if (profileImage.isEmpty()) {
                response.put("success", false);
                response.put("message", "파일이 비어있습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 이미지 파일 타입 검증
            String contentType = profileImage.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                response.put("success", false);
                response.put("message", "이미지 파일만 업로드 가능합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 저장 폴더 생성
            File folder = new File(profileFolderPath);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            // 고유 파일명 생성
            String originalName = profileImage.getOriginalFilename();
            String ext = originalName != null && originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf("."))
                    : ".png";
            String savedName = UUID.randomUUID().toString() + ext;

            // 파일 저장
            profileImage.transferTo(new File(profileFolderPath + savedName));

            // 웹 경로 반환
            String imageUrl = profileWebPath + savedName;

            response.put("success", true);
            response.put("imageUrl", imageUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("프로필 이미지 업로드 실패", e);
            response.put("success", false);
            response.put("message", "이미지 업로드 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 인증서류 이미지 업로드
     */
    @PostMapping("/verification")
    public ResponseEntity<Map<String, Object>> submitVerification(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile file) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.replace("Bearer ", "");
            int memberNo = jwtUtil.getMemberNo(token);

            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "파일이 비어있습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            int result = verificationService.submitVerification(
                    memberNo, file, verificationWebPath, verificationFolderPath);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "인증 서류가 제출되었습니다." : "인증 서류 제출에 실패했습니다.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("인증서류 제출 실패", e);
            response.put("success", false);
            response.put("message", "인증서류 제출 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 내 인증 상태 조회
     */
    @GetMapping("/verification/status")
    public ResponseEntity<Map<String, Object>> getVerificationStatus(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.replace("Bearer ", "");
            int memberNo = jwtUtil.getMemberNo(token);

            MemberVerificationDTO verification = verificationService.getVerificationStatus(memberNo);

            response.put("success", true);
            response.put("data", verification);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("인증 상태 조회 실패", e);
            response.put("success", false);
            response.put("message", "인증 상태 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 이메일 마스킹 처리 (보안)
     * @param email
     * @return 마스킹된 이메일 (예: test*** @example.com)
     */
    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return email;
        }
        
        String[] parts = email.split("@");
        String localPart = parts[0];
        String domain = parts[1];
        
        // 앞 4자리만 표시하고 나머지는 ***
        if (localPart.length() <= 4) {
            return localPart + "***@" + domain;
        } else {
            return localPart.substring(0, 4) + "***@" + domain;
        }
    }
}