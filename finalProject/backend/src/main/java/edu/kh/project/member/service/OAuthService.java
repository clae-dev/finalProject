package edu.kh.project.member.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.member.dto.LoginResponseDTO;
import edu.kh.project.member.dto.MemberDTO;
import edu.kh.project.member.dto.SignupRequestDTO;
import edu.kh.project.member.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OAuthService {

    private final RestTemplate restTemplate;
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${kakao.client.id}")
    private String kakaoClientId;

    @Value("${kakao.client.secret}")
    private String kakaoClientSecret;

    @Value("${kakao.redirect.uri}")
    private String kakaoRedirectUri;

    /**
     * 카카오 로그인 처리
     * 1. 인가 코드로 액세스 토큰 요청
     * 2. 액세스 토큰으로 사용자 정보 조회
     * 3. 회원 조회 또는 신규 가입
     * 4. JWT 발급
     */
    @SuppressWarnings("unchecked")
    public LoginResponseDTO kakaoLogin(String code) {

        // 1. 인가 코드 → 카카오 액세스 토큰 교환
        String kakaoAccessToken = getKakaoAccessToken(code);

        // 2. 카카오 액세스 토큰 → 사용자 정보 조회
        Map<String, Object> kakaoUser = getKakaoUserInfo(kakaoAccessToken);

        Map<String, Object> kakaoAccount = (Map<String, Object>) kakaoUser.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String email = (String) kakaoAccount.get("email");
        String nickname = (String) profile.get("nickname");
        String profileImage = (String) profile.get("profile_image_url");

        // 이메일이 null인 경우 카카오 ID 기반으로 대체 이메일 생성
        if (email == null || email.isBlank()) {
            Object kakaoId = kakaoUser.get("id");
            email = "kakao_" + kakaoId + "@kakao.user";
            log.info("카카오 이메일 미제공 - 대체 이메일 생성: {}", email);
        }

        log.info("카카오 로그인 - email: {}, nickname: {}", email, nickname);

        // 3. 기존 회원 조회
        MemberDTO member = memberMapper.selectMemberByEmail(email);

        if (member == null) {
            // 신규 회원 가입
            String tempNickname = nickname;

            // 닉네임 중복 시 랜덤 접미사 추가
            if (memberMapper.checkNicknameDuplicate(tempNickname) > 0) {
                tempNickname = nickname + "_" + UUID.randomUUID().toString().substring(0, 4);
            }

            SignupRequestDTO signupRequest = new SignupRequestDTO();
            signupRequest.setMemberEmail(email);
            signupRequest.setMemberPw(passwordEncoder.encode(UUID.randomUUID().toString()));
            signupRequest.setMemberNickname(tempNickname);
            signupRequest.setMemberName(nickname);

            memberMapper.insertMember(signupRequest);

            // 방금 가입한 회원 조회
            member = memberMapper.selectMemberByEmail(email);
            log.info("카카오 신규 회원 가입 완료 - memberNo: {}", member.getMemberNo());
        }

        // 4. JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(
                member.getMemberNo(),
                member.getMemberEmail(),
                member.getMemberRole()
        );
        String refreshToken = jwtUtil.generateRefreshToken(member.getMemberNo());

        // 5. 프로필 이미지 업데이트 (카카오에서 가져온 이미지가 있고, 기존에 없는 경우)
        if (profileImage != null && member.getMemberProfileImg() == null) {
            member.setMemberProfileImg(profileImage);
            memberMapper.updateMember(member);
        }

        return LoginResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .memberNo(member.getMemberNo())
                .memberEmail(member.getMemberEmail())
                .memberName(member.getMemberName())
                .memberNickname(member.getMemberNickname())
                .memberProfileImg(member.getMemberProfileImg())
                .memberRole(member.getMemberRole())
                .build();
    }

    /**
     * 카카오 인가 코드로 액세스 토큰 요청 (HttpURLConnection 사용)
     */
    private String getKakaoAccessToken(String code) {
        try {
            String tokenUrl = "https://kauth.kakao.com/oauth/token";

            String params = "grant_type=authorization_code"
                    + "&client_id=" + kakaoClientId
                    + "&client_secret=" + kakaoClientSecret
                    + "&redirect_uri=" + java.net.URLEncoder.encode(kakaoRedirectUri, StandardCharsets.UTF_8)
                    + "&code=" + code;

            log.info("카카오 토큰 요청 파라미터 전체: {}", params);

            URL url = new URL(tokenUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
            conn.setDoOutput(true);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(params.getBytes(StandardCharsets.UTF_8));
            }

            int responseCode = conn.getResponseCode();
            BufferedReader br;

            if (responseCode >= 200 && responseCode < 300) {
                br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
            } else {
                br = new BufferedReader(new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8));
            }

            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }
            br.close();

            String responseBody = sb.toString();
            log.info("카카오 토큰 응답 - status: {}, body: {}", responseCode, responseBody);

            if (responseCode != 200) {
                throw new RuntimeException("카카오 토큰 요청 실패 (" + responseCode + "): " + responseBody);
            }

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> body = mapper.readValue(responseBody, new TypeReference<Map<String, Object>>() {});

            if (!body.containsKey("access_token")) {
                throw new RuntimeException("카카오 토큰 응답에 access_token 없음: " + responseBody);
            }

            return (String) body.get("access_token");

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("카카오 토큰 요청 중 예외", e);
            throw new RuntimeException("카카오 토큰 요청 실패", e);
        }
    }

    /**
     * 카카오 액세스 토큰으로 사용자 정보 조회
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> getKakaoUserInfo(String accessToken) {
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                userInfoUrl, HttpMethod.GET, request, Map.class
        );

        Map<String, Object> body = response.getBody();
        if (body == null) {
            throw new RuntimeException("카카오 사용자 정보 조회 실패");
        }

        return body;
    }
}
