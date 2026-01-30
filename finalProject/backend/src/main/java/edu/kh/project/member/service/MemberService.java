package edu.kh.project.member.service;

//import edu.kh.project.member.dto.LoginRequestDTO;
//import edu.kh.project.member.dto.LoginResponseDTO;
import edu.kh.project.member.dto.MemberDTO;
//import edu.kh.project.member.dto.SignupRequestDTO;

/**
 * 회원 Service 인터페이스
 */
public interface MemberService {
    
    /**
     * 이메일 중복 확인
     * @param memberEmail
     * @return 중복 개수 (0: 사용 가능, 1 이상: 중복)
     */
    int checkEmail(String memberEmail);
    
    /**
     * 닉네임 중복 확인
     * @param memberNickname
     * @return 중복 개수 (0: 사용 가능, 1 이상: 중복)
     */
    int checkNickname(String memberNickname);
    
    /**
     * 회원가입
     * @param signupRequest
     * @return 성공한 행의 개수
     */
    //int signup(SignupRequestDTO signupRequest);
    
    /**
     * 로그인
     * @param loginRequest
     * @return LoginResponseDTO (JWT 토큰 + 회원 정보) / 실패 시 null
     */
    //LoginResponseDTO login(LoginRequestDTO loginRequest);
    
    /**
     * 회원 번호로 회원 조회
     * @param memberNo
     * @return MemberDTO
     */
    MemberDTO getMemberByNo(int memberNo);
    
    /**
     * 아이디 찾기 (이름 + 이메일)
     * @param memberName : 회원 이름
     * @param memberEmail : 회원 이메일
     * @return MemberDTO (이메일, 가입일자)
     */
    MemberDTO findId(String memberName, String memberEmail);
    
    /**
     * 비밀번호 찾기 (이메일 + 이름 + 이메일)
     * @param memberEmail : 회원 이메일
     * @param memberName : 회원 이름
     * @param memberEmail2 : 회원 이메일 확인
     * @return MemberDTO / 없으면 null
     */
    MemberDTO findPw(String memberEmail, String memberName, String memberEmail2);
    
    /**
     * 비밀번호 재설정
     * @param memberEmail : 회원 이메일
     * @param newPw : 새 비밀번호
     * @return 성공한 행의 개수
     */
    int resetPw(String memberEmail, String newPw);
    
    /**
     * 회원 정보 수정
     * @param member
     * @return 성공한 행의 개수
     */
    int updateMember(MemberDTO member);
    
    /**
     * 회원 탈퇴
     * @param memberNo : 회원 번호
     * @param memberPw : 비밀번호 (확인용)
     * @return 성공한 행의 개수
     */
    int withdrawMember(int memberNo, String memberPw);
}