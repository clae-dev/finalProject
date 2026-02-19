package edu.kh.project.member.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import edu.kh.project.member.dto.MemberDTO;
import edu.kh.project.member.dto.SignupRequestDTO;

/**
 * 회원 MyBatis Mapper 인터페이스
 *
 * <p>MEMBER 테이블에 대한 SQL 매핑 인터페이스.
 * 회원 CRUD, 인증, 아이디/비밀번호 찾기, 활동 내역 조회를 정의한다.</p>
 *
 * @author HONDI
 */
@Mapper
public interface MemberMapper {
    
    /**
     * 이메일로 회원 조회 (로그인용)
     * @param memberEmail 이메일
     * @return 회원 정보 (비밀번호 포함)
     */
    MemberDTO selectMemberByEmail(@Param("memberEmail") String memberEmail);
    
    /**
     * 회원 번호로 회원 조회
     * @param memberNo 회원 번호
     * @return 회원 정보
     */
    MemberDTO selectMemberByNo(@Param("memberNo") int memberNo);
    
    /**
     * 이메일 중복 확인
     * @param memberEmail 이메일
     * @return 중복 개수 (0: 사용 가능, 1 이상: 중복)
     */
    int checkEmailDuplicate(@Param("memberEmail") String memberEmail);
    
    /**
     * 닉네임 중복 확인 (memberNo 전달 시 본인 제외)
     * @param memberNickname 닉네임
     * @param memberNo 본인 회원번호 (null이면 전체 대상)
     * @return 중복 개수 (0: 사용 가능, 1 이상: 중복)
     */
    int checkNicknameDuplicate(@Param("memberNickname") String memberNickname,
                               @Param("memberNo") Integer memberNo);
    
    /**
     * 회원가입 (INSERT)
     * @param signupRequest 회원가입 정보
     * @return 삽입된 행 수
     */
    int insertMember(SignupRequestDTO signupRequest);
    
    /**
     * 회원 정보 수정
     * @param member 수정할 회원 정보
     * @return 수정된 행 수
     */
    int updateMember(MemberDTO member);
    
    /**
     * 회원 탈퇴 (상태 변경)
     * @param memberNo 회원 번호
     * @return 수정된 행 수
     */
    int withdrawMember(@Param("memberNo") int memberNo);
    
    /**
     * 이메일 인증 완료 처리
     * @param memberEmail 이메일
     * @return 수정된 행 수
     */
    int updateEmailVerified(@Param("memberEmail") String memberEmail);
    
    /**
     * 아이디 찾기 (이름 + 이메일)
     * @param memberName 회원 이름
     * @param memberEmail 회원 이메일
     * @return 회원 정보 (이메일, 가입일)
     */
    MemberDTO findId(@Param("memberName") String memberName, 
                     @Param("memberEmail") String memberEmail);
    
    /**
     * 비밀번호 찾기 (이메일 + 이름)
     * @param memberEmail 회원 이메일
     * @param memberName 회원 이름
     * @return 회원 정보
     */
    MemberDTO findPw(@Param("memberEmail") String memberEmail, 
                     @Param("memberName") String memberName);
    
    /**
     * 비밀번호 재설정
     * @param memberEmail 회원 이메일
     * @param memberPw 새 비밀번호 (암호화된)
     * @return 수정된 행 수
     */
    int resetPw(@Param("memberEmail") String memberEmail,
                @Param("memberPw") String memberPw);

    /** 내가 작성한 글 목록 */
    List<Map<String, Object>> selectMyPosts(@Param("memberNo") int memberNo);

    /** 내가 작성한 후기 목록 */
    List<Map<String, Object>> selectMyReviews(@Param("memberNo") int memberNo);

    /** 내가 좋아요한 글 목록 */
    List<Map<String, Object>> selectMyLikes(@Param("memberNo") int memberNo);
}