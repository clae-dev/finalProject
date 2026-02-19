package edu.kh.project.member.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

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

/**
 * OAuth2 소셜 로그인 서비스
 *
 * <p>카카오, 네이버, 구글 OAuth2 로그인/로그아웃 비즈니스 로직을 구현한다.
 * 인가 코드 → 액세스 토큰 교환 → 사용자 정보 조회 → 회원 자동 가입 → JWT 발급 흐름을 처리하며,
 * OAuth 액세스 토큰을 인메모리(ConcurrentHashMap)에 저장하여 로그아웃 시 활용한다.</p>
 *
 * @author HONDI
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OAuthService {

    private final RestTemplate restTemplate;
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // OAuth access token 인메모리 저장 (memberNo → accessToken)
    private final ConcurrentHashMap<Integer, String> kakaoTokenStore = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<Integer, String> naverTokenStore = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<Integer, String> googleTokenStore = new ConcurrentHashMap<>();

    @Value("${kakao.client.id}")
    private String kakaoClientId;

    @Value("${kakao.client.secret}")
    private String kakaoClientSecret;

    @Value("${kakao.redirect.uri}")
    private String kakaoRedirectUri;

    @Value("${naver.client.id}")
    private String naverClientId;

    @Value("${naver.client.secret}")
    private String naverClientSecret;

    @Value("${naver.redirect.uri}")
    private String naverRedirectUri;

    @Value("${google.client.id}")
    private String googleClientId;

    @Value("${google.client.secret}")
    private String googleClientSecret;

    @Value("${google.redirect.uri}")
    private String googleRedirectUri;

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
            if (memberMapper.checkNicknameDuplicate(tempNickname, null) > 0) {
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

        // 4. 카카오 access token 저장 (연동 해제용)
        kakaoTokenStore.put(member.getMemberNo(), kakaoAccessToken);
        log.info("카카오 토큰 저장 - memberNo: {}", member.getMemberNo());

        // 5. JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(
                member.getMemberNo(),
                member.getMemberEmail(),
                member.getMemberRole()
        );
        String refreshToken = jwtUtil.generateRefreshToken(member.getMemberNo());

        // 6. 프로필 이미지 업데이트 (카카오에서 가져온 이미지가 있고, 기존에 없는 경우)
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
                .loginType("kakao")
                .build();
    }

    /**
     * 카카오 로그아웃 (세션 만료)
     * - 저장된 카카오 access token으로 로그아웃 API 호출
     * - 다음 로그인 시 다른 계정 선택 가능
     * - best-effort: 토큰 없거나 만료 시에도 에러 없이 처리
     */
    public void kakaoLogout(int memberNo) {
        String kakaoAccessToken = kakaoTokenStore.remove(memberNo);

        if (kakaoAccessToken == null) {
            log.warn("카카오 logout 스킵 - 저장된 토큰 없음 (memberNo: {})", memberNo);
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(kakaoAccessToken);

            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://kapi.kakao.com/v1/user/logout",
                    HttpMethod.POST,
                    request,
                    String.class
            );

            log.info("카카오 로그아웃 성공 - memberNo: {}, response: {}", memberNo, response.getBody());
        } catch (Exception e) {
            log.warn("카카오 로그아웃 실패 (best-effort) - memberNo: {}, error: {}", memberNo, e.getMessage());
        }
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

    /**
     * 네이버 로그인 처리
     * 1. 인가 코드로 액세스 토큰 요청
     * 2. 액세스 토큰으로 사용자 정보 조회
     * 3. 회원 조회 또는 신규 가입
     * 4. JWT 발급
     */
    @SuppressWarnings("unchecked")
    public LoginResponseDTO naverLogin(String code, String state) {

        // 1. 인가 코드 → 네이버 액세스 토큰 교환
        String naverAccessToken = getNaverAccessToken(code, state);

        // 2. 네이버 액세스 토큰 → 사용자 정보 조회
        Map<String, Object> naverUser = getNaverUserInfo(naverAccessToken);

        // 네이버 응답 구조: { "resultcode": "00", "message": "success", "response": { ... } }
        Map<String, Object> response = (Map<String, Object>) naverUser.get("response");

        String email = (String) response.get("email");
        String nickname = (String) response.get("nickname");
        String profileImage = (String) response.get("profile_image");
        String name = (String) response.get("name");

        // 이메일이 null인 경우 네이버 ID 기반으로 대체 이메일 생성
        if (email == null || email.isBlank()) {
            String naverId = (String) response.get("id");
            email = "naver_" + naverId + "@naver.user";
            log.info("네이버 이메일 미제공 - 대체 이메일 생성: {}", email);
        }

        // 표시 이름 결정: name > nickname > "네이버사용자"
        String displayName = name != null ? name : (nickname != null ? nickname : "네이버사용자");

        log.info("네이버 로그인 - email: {}, nickname: {}, name: {}", email, nickname, name);

        // 3. 기존 회원 조회
        MemberDTO member = memberMapper.selectMemberByEmail(email);

        if (member == null) {
            // 신규 회원 가입
            String tempNickname = nickname != null ? nickname : displayName;

            // 닉네임 중복 시 랜덤 접미사 추가
            if (memberMapper.checkNicknameDuplicate(tempNickname, null) > 0) {
                tempNickname = tempNickname + "_" + UUID.randomUUID().toString().substring(0, 4);
            }

            SignupRequestDTO signupRequest = new SignupRequestDTO();
            signupRequest.setMemberEmail(email);
            signupRequest.setMemberPw(passwordEncoder.encode(UUID.randomUUID().toString()));
            signupRequest.setMemberNickname(tempNickname);
            signupRequest.setMemberName(displayName);

            memberMapper.insertMember(signupRequest);

            // 방금 가입한 회원 조회
            member = memberMapper.selectMemberByEmail(email);
            log.info("네이버 신규 회원 가입 완료 - memberNo: {}", member.getMemberNo());
        }

        // 4. 네이버 access token 저장 (로그아웃용)
        naverTokenStore.put(member.getMemberNo(), naverAccessToken);
        log.info("네이버 토큰 저장 - memberNo: {}", member.getMemberNo());

        // 5. JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(
                member.getMemberNo(),
                member.getMemberEmail(),
                member.getMemberRole()
        );
        String refreshToken = jwtUtil.generateRefreshToken(member.getMemberNo());

        // 6. 프로필 이미지 업데이트 (네이버에서 가져온 이미지가 있고, 기존에 없는 경우)
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
                .loginType("naver")
                .build();
    }

    /**
     * 네이버 로그아웃 (토큰 삭제)
     * - 네이버 토큰 만료 API 호출
     * - best-effort
     */
    public void naverLogout(int memberNo) {
        String naverAccessToken = naverTokenStore.remove(memberNo);

        if (naverAccessToken == null) {
            log.warn("네이버 logout 스킵 - 저장된 토큰 없음 (memberNo: {})", memberNo);
            return;
        }

        try {
            String revokeUrl = "https://nid.naver.com/oauth2.0/token"
                    + "?grant_type=delete"
                    + "&client_id=" + naverClientId
                    + "&client_secret=" + naverClientSecret
                    + "&access_token=" + naverAccessToken
                    + "&service_provider=NAVER";

            ResponseEntity<String> response = restTemplate.getForEntity(revokeUrl, String.class);
            log.info("네이버 로그아웃 성공 - memberNo: {}, response: {}", memberNo, response.getBody());
        } catch (Exception e) {
            log.warn("네이버 로그아웃 실패 (best-effort) - memberNo: {}, error: {}", memberNo, e.getMessage());
        }
    }

    /**
     * 네이버 인가 코드로 액세스 토큰 요청 (HttpURLConnection 사용)
     */
    private String getNaverAccessToken(String code, String state) {
        try {
            String tokenUrl = "https://nid.naver.com/oauth2.0/token";

            String params = "grant_type=authorization_code"
                    + "&client_id=" + naverClientId
                    + "&client_secret=" + naverClientSecret
                    + "&code=" + code
                    + "&state=" + state;

            log.info("네이버 토큰 요청 URL: {}", tokenUrl);

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
            log.info("네이버 토큰 응답 - status: {}, body: {}", responseCode, responseBody);

            if (responseCode != 200) {
                throw new RuntimeException("네이버 토큰 요청 실패 (" + responseCode + "): " + responseBody);
            }

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> body = mapper.readValue(responseBody, new TypeReference<Map<String, Object>>() {});

            if (!body.containsKey("access_token")) {
                throw new RuntimeException("네이버 토큰 응답에 access_token 없음: " + responseBody);
            }

            return (String) body.get("access_token");

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("네이버 토큰 요청 중 예외", e);
            throw new RuntimeException("네이버 토큰 요청 실패", e);
        }
    }

    /**
     * 네이버 액세스 토큰으로 사용자 정보 조회
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> getNaverUserInfo(String accessToken) {
        String userInfoUrl = "https://openapi.naver.com/v1/nid/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> naverResponse = restTemplate.exchange(
                userInfoUrl, HttpMethod.GET, request, Map.class
        );

        Map<String, Object> body = naverResponse.getBody();
        if (body == null) {
            throw new RuntimeException("네이버 사용자 정보 조회 실패");
        }

        return body;
    }

    /**
     * 구글 로그인 처리
     * 1. 인가 코드로 액세스 토큰 요청
     * 2. 액세스 토큰으로 사용자 정보 조회
     * 3. 회원 조회 또는 신규 가입
     * 4. JWT 발급
     */
    @SuppressWarnings("unchecked")
    public LoginResponseDTO googleLogin(String code) {

        // 1. 인가 코드 → 구글 액세스 토큰 교환
        String googleAccessToken = getGoogleAccessToken(code);

        // 2. 구글 액세스 토큰 → 사용자 정보 조회
        Map<String, Object> googleUser = getGoogleUserInfo(googleAccessToken);

        // 구글 응답 구조: { "sub": "...", "email": "...", "name": "...", "picture": "..." }
        String email = (String) googleUser.get("email");
        String name = (String) googleUser.get("name");
        String profileImage = (String) googleUser.get("picture");

        // 이메일이 null인 경우 구글 sub 기반으로 대체 이메일 생성
        if (email == null || email.isBlank()) {
            String googleSub = (String) googleUser.get("sub");
            email = "google_" + googleSub + "@google.user";
            log.info("구글 이메일 미제공 - 대체 이메일 생성: {}", email);
        }

        String displayName = name != null ? name : "구글사용자";

        log.info("구글 로그인 - email: {}, name: {}", email, name);

        // 3. 기존 회원 조회
        MemberDTO member = memberMapper.selectMemberByEmail(email);

        if (member == null) {
            // 신규 회원 가입
            String tempNickname = displayName;

            // 닉네임 중복 시 랜덤 접미사 추가
            if (memberMapper.checkNicknameDuplicate(tempNickname, null) > 0) {
                tempNickname = displayName + "_" + UUID.randomUUID().toString().substring(0, 4);
            }

            SignupRequestDTO signupRequest = new SignupRequestDTO();
            signupRequest.setMemberEmail(email);
            signupRequest.setMemberPw(passwordEncoder.encode(UUID.randomUUID().toString()));
            signupRequest.setMemberNickname(tempNickname);
            signupRequest.setMemberName(displayName);

            memberMapper.insertMember(signupRequest);

            // 방금 가입한 회원 조회
            member = memberMapper.selectMemberByEmail(email);
            log.info("구글 신규 회원 가입 완료 - memberNo: {}", member.getMemberNo());
        }

        // 4. 구글 access token 저장 (로그아웃용)
        googleTokenStore.put(member.getMemberNo(), googleAccessToken);
        log.info("구글 토큰 저장 - memberNo: {}", member.getMemberNo());

        // 5. JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(
                member.getMemberNo(),
                member.getMemberEmail(),
                member.getMemberRole()
        );
        String refreshToken = jwtUtil.generateRefreshToken(member.getMemberNo());

        // 6. 프로필 이미지 업데이트 (구글에서 가져온 이미지가 있고, 기존에 없는 경우)
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
                .loginType("google")
                .build();
    }

    /**
     * 구글 로그아웃 (토큰 취소)
     * - 구글 토큰 revoke API 호출
     * - best-effort
     */
    public void googleLogout(int memberNo) {
        String googleAccessToken = googleTokenStore.remove(memberNo);

        if (googleAccessToken == null) {
            log.warn("구글 logout 스킵 - 저장된 토큰 없음 (memberNo: {})", memberNo);
            return;
        }

        try {
            String revokeUrl = "https://oauth2.googleapis.com/revoke?token=" + googleAccessToken;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/x-www-form-urlencoded");
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    revokeUrl, HttpMethod.POST, request, String.class
            );
            log.info("구글 로그아웃 성공 - memberNo: {}, response: {}", memberNo, response.getBody());
        } catch (Exception e) {
            log.warn("구글 로그아웃 실패 (best-effort) - memberNo: {}, error: {}", memberNo, e.getMessage());
        }
    }

    /**
     * 구글 인가 코드로 액세스 토큰 요청 (HttpURLConnection 사용)
     */
    private String getGoogleAccessToken(String code) {
        try {
            String tokenUrl = "https://oauth2.googleapis.com/token";

            String params = "grant_type=authorization_code"
                    + "&client_id=" + googleClientId
                    + "&client_secret=" + googleClientSecret
                    + "&redirect_uri=" + java.net.URLEncoder.encode(googleRedirectUri, StandardCharsets.UTF_8)
                    + "&code=" + code;

            log.info("구글 토큰 요청 URL: {}", tokenUrl);

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
            log.info("구글 토큰 응답 - status: {}, body: {}", responseCode, responseBody);

            if (responseCode != 200) {
                throw new RuntimeException("구글 토큰 요청 실패 (" + responseCode + "): " + responseBody);
            }

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> body = mapper.readValue(responseBody, new TypeReference<Map<String, Object>>() {});

            if (!body.containsKey("access_token")) {
                throw new RuntimeException("구글 토큰 응답에 access_token 없음: " + responseBody);
            }

            return (String) body.get("access_token");

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("구글 토큰 요청 중 예외", e);
            throw new RuntimeException("구글 토큰 요청 실패", e);
        }
    }

    /**
     * 구글 액세스 토큰으로 사용자 정보 조회
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> getGoogleUserInfo(String accessToken) {
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> googleResponse = restTemplate.exchange(
                userInfoUrl, HttpMethod.GET, request, Map.class
        );

        Map<String, Object> body = googleResponse.getBody();
        if (body == null) {
            throw new RuntimeException("구글 사용자 정보 조회 실패");
        }

        return body;
    }
}
