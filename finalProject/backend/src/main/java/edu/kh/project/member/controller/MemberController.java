package edu.kh.project.member.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.kh.project.member.dto.LoginRequestDTO;
import edu.kh.project.member.dto.LoginResponseDTO;
import edu.kh.project.member.dto.MemberDTO;
import edu.kh.project.member.dto.SignupRequestDTO;
import edu.kh.project.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 회원 REST API Controller
 * - 회원가입, 로그인, 정보 수정 등 회원 관련 API
 */
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@Slf4j
public class MemberController {
    
    private final MemberService memberService;
    
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
     * @return 사용 가능 여부
     */
    @GetMapping("/check-nickname")
    public ResponseEntity<Map<String, Object>> checkNickname(
            @RequestParam("memberNickname") String memberNickname) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            int count = memberService.checkNickname(memberNickname);
            
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
     * 회원 정보 조회
     * @param memberNo
     * @return 회원 정보
     */
    @GetMapping("/{memberNo}")
    public ResponseEntity<Map<String, Object>> getMember(
            @PathVariable("memberNo") int memberNo) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            MemberDTO member = memberService.getMemberByNo(memberNo);
            
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