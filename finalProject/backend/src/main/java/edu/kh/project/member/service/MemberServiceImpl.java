package edu.kh.project.member.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.admin.mapper.AdminMapper;
import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.member.dto.LoginRequestDTO;
import edu.kh.project.member.dto.LoginResponseDTO;
import edu.kh.project.member.dto.MemberDTO;
import edu.kh.project.member.dto.SignupRequestDTO;
import edu.kh.project.member.mapper.MemberMapper;
import edu.kh.project.notification.dto.NotificationDTO;
import edu.kh.project.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 회원 서비스 구현체
 *
 * <p>회원가입(BCrypt 암호화), 로그인(JWT 발급), 회원 정보 수정,
 * 아이디/비밀번호 찾기, Refresh Token Rotation, 활동 내역 조회를 구현한다.</p>
 *
 * @author HONDI
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService {
    
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final NotificationService notificationService;
    private final AdminMapper adminMapper;

    /**
     * 이메일 중복 확인
     */
    @Override
    public int checkEmail(String memberEmail) {
        return memberMapper.checkEmailDuplicate(memberEmail);
    }

    /**
     * 닉네임 중복 확인 (memberNo 전달 시 본인 제외)
     */
    @Override
    public int checkNickname(String memberNickname, Integer memberNo) {
        return memberMapper.checkNicknameDuplicate(memberNickname, memberNo);
    }

    /**
     * 회원가입
     */
    @Override
    public int signup(SignupRequestDTO signupRequest) {
        
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(signupRequest.getMemberPw());
        signupRequest.setMemberPw(encodedPassword);
        
        // 회원가입 처리
        int result = memberMapper.insertMember(signupRequest);
        
        if (result > 0) {
            log.info("회원가입 성공: {}", signupRequest.getMemberEmail());

            for (int adminNo : adminMapper.selectAdminMemberNos()) {
                notificationService.createNotification(NotificationDTO.builder()
                        .recipientNo(adminNo)
                        .notificationType("NEW_MEMBER")
                        .targetType("ADMIN_MEMBER")
                        .targetNo(0)
                        .title("새 회원 가입")
                        .content(signupRequest.getMemberNickname() + " 님이 가입했습니다.")
                        .build());
            }
        }

        return result;
    }

    /**
     * 로그인
     */
    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        
        // 1. 이메일로 회원 조회
        MemberDTO member = memberMapper.selectMemberByEmail(loginRequest.getMemberEmail());
        
        if (member == null) return null;
        
        // 2. 비밀번호 확인
        if (!passwordEncoder.matches(loginRequest.getMemberPw(), member.getMemberPw())) {
            return null;
        }
        
        // 3. 계정 상태 확인
        if (!"A".equals(member.getMemberStatus())) return null;
        
        // 4. JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(
            member.getMemberNo(), 
            member.getMemberEmail(), 
            member.getMemberRole()
        );
        
        String refreshToken = jwtUtil.generateRefreshToken(member.getMemberNo());
        
        // 5. 응답 DTO 생성
        LoginResponseDTO response = LoginResponseDTO.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .memberNo(member.getMemberNo())
            .memberEmail(member.getMemberEmail())
            .memberName(member.getMemberName())
            .memberNickname(member.getMemberNickname())
            .memberProfileImg(member.getMemberProfileImg())
            .memberRole(member.getMemberRole())
            .memberPhone(member.getMemberPhone())
            .memberIntro(member.getMemberIntro())
            .verifiedReviewer(member.getVerifiedReviewer())
            .build();

        log.info("로그인 성공: {}", member.getMemberEmail());

        return response;
    }

    /**
     * 회원 번호로 회원 조회
     */
    @Override
    public MemberDTO getMemberByNo(int memberNo) {
        return memberMapper.selectMemberByNo(memberNo);
    }

    /**
     * 아이디 찾기 (이름 + 이메일)
     */
    @Override
    public MemberDTO findId(String memberName, String memberEmail) {
        return memberMapper.findId(memberName, memberEmail);
    }

    /**
     * 비밀번호 찾기
     */
    @Override
    public MemberDTO findPw(String memberEmail, String memberName, String memberEmail2) {
        
        // 이메일 일치 확인
        if (!memberEmail.equals(memberEmail2)) return null;
        
        return memberMapper.findPw(memberEmail, memberName);
    }

    /**
     * 비밀번호 재설정
     */
    @Override
    public int resetPw(String memberEmail, String newPw) {
        
        // 새 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(newPw);
        
        return memberMapper.resetPw(memberEmail, encodedPassword);
    }

    /**
     * 회원 정보 수정
     */
    @Override
    public int updateMember(MemberDTO member) {
        return memberMapper.updateMember(member);
    }

    /**
     * Refresh Token으로 토큰 갱신 (Refresh Token Rotation)
     */
    @Override
    public LoginResponseDTO refreshToken(String refreshToken) {

        // 1. 리프레시 토큰 검증
        if (!jwtUtil.validateToken(refreshToken)) {
            log.warn("유효하지 않은 리프레시 토큰");
            return null;
        }

        // 2. 토큰에서 회원 번호 추출
        int memberNo = jwtUtil.getMemberNo(refreshToken);

        // 3. 회원 조회
        MemberDTO member = memberMapper.selectMemberByNo(memberNo);

        if (member == null) {
            log.warn("토큰 갱신 실패: 회원을 찾을 수 없음 (memberNo: {})", memberNo);
            return null;
        }

        // 4. 계정 상태 확인
        if (!"A".equals(member.getMemberStatus())) {
            log.warn("토큰 갱신 실패: 비활성 계정 (memberNo: {})", memberNo);
            return null;
        }

        // 5. 새 토큰 쌍 생성 (Refresh Token Rotation)
        String newAccessToken = jwtUtil.generateAccessToken(
            member.getMemberNo(),
            member.getMemberEmail(),
            member.getMemberRole()
        );

        String newRefreshToken = jwtUtil.generateRefreshToken(member.getMemberNo());

        // 6. 응답 DTO 생성
        LoginResponseDTO response = LoginResponseDTO.builder()
            .accessToken(newAccessToken)
            .refreshToken(newRefreshToken)
            .memberNo(member.getMemberNo())
            .memberEmail(member.getMemberEmail())
            .memberName(member.getMemberName())
            .memberNickname(member.getMemberNickname())
            .memberProfileImg(member.getMemberProfileImg())
            .memberRole(member.getMemberRole())
            .memberPhone(member.getMemberPhone())
            .memberIntro(member.getMemberIntro())
            .verifiedReviewer(member.getVerifiedReviewer())
            .build();

        log.info("토큰 갱신 성공: {}", member.getMemberEmail());

        return response;
    }

    /**
     * 회원 활동 내역 조회
     */
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getMyActivity(int memberNo) {
        Map<String, Object> result = new HashMap<>();
        result.put("posts", memberMapper.selectMyPosts(memberNo));
        result.put("reviews", memberMapper.selectMyReviews(memberNo));
        result.put("likes", memberMapper.selectMyLikes(memberNo));
        return result;
    }

    /**
     * 비밀번호 변경 (현재 비밀번호 확인 후)
     */
    @Override
    public int changePassword(int memberNo, String currentPassword, String newPassword) {

        // 1. 회원 조회
        MemberDTO member = memberMapper.selectMemberByNo(memberNo);

        if (member == null) return 0;

        // 2. 현재 비밀번호 확인
        if (!passwordEncoder.matches(currentPassword, member.getMemberPw())) {
            return 0;
        }

        // 3. 새 비밀번호 암호화 후 업데이트
        String encodedPassword = passwordEncoder.encode(newPassword);
        return memberMapper.resetPw(member.getMemberEmail(), encodedPassword);
    }

    /**
     * 회원 탈퇴
     */
    @Override
    public int withdrawMember(int memberNo, String memberPw) {
        
        // 1. 회원 조회
        MemberDTO member = memberMapper.selectMemberByNo(memberNo);
        
        if (member == null) return 0;
        
        // 2. 비밀번호 확인
        if (!passwordEncoder.matches(memberPw, member.getMemberPw())) {
            return 0;
        }
        
        // 3. 탈퇴 처리
        int result = memberMapper.withdrawMember(memberNo);
        
        if (result > 0) {
            log.info("회원 탈퇴 성공: {}", member.getMemberEmail());
        }
        
        return result;
    }
}