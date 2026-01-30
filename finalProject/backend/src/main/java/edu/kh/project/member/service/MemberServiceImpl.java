package edu.kh.project.member.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.member.dto.LoginRequestDTO;
import edu.kh.project.member.dto.LoginResponseDTO;
import edu.kh.project.member.dto.MemberDTO;
import edu.kh.project.member.dto.SignupRequestDTO;
import edu.kh.project.member.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 회원 Service 구현체
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService {
    
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * 이메일 중복 확인
     */
    @Override
    public int checkEmail(String memberEmail) {
        return memberMapper.checkEmailDuplicate(memberEmail);
    }

    /**
     * 닉네임 중복 확인
     */
    @Override
    public int checkNickname(String memberNickname) {
        return memberMapper.checkNicknameDuplicate(memberNickname);
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
        if (!"ACTIVE".equals(member.getMemberStatus())) return null;
        
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
            .memberNickname(member.getMemberNickname())
            .memberProfileImg(member.getMemberProfileImg())
            .memberRole(member.getMemberRole())
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