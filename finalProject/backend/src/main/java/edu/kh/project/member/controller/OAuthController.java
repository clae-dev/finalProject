package edu.kh.project.member.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.member.dto.LoginResponseDTO;
import edu.kh.project.member.service.OAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class OAuthController {

    private final OAuthService oAuthService;
    private final JwtUtil jwtUtil;

    @Value("${kakao.client.id}")
    private String kakaoClientId;

    @Value("${kakao.redirect.uri}")
    private String kakaoRedirectUri;

    @Value("${naver.client.id}")
    private String naverClientId;

    @Value("${naver.redirect.uri}")
    private String naverRedirectUri;

    @Value("${google.client.id}")
    private String googleClientId;

    @Value("${google.redirect.uri}")
    private String googleRedirectUri;

    @Value("${frontend.url}")
    private String frontendUrl;

    /**
     * 카카오 인증 페이지로 리다이렉트
     */
    @GetMapping("/oauth2/authorization/kakao")
    public String redirectToKakao() {
        String kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize"
                + "?client_id=" + kakaoClientId
                + "&redirect_uri=" + URLEncoder.encode(kakaoRedirectUri, StandardCharsets.UTF_8)
                + "&response_type=code"
                + "&scope=profile_nickname,profile_image,account_email"
                + "&prompt=login";

        log.info("카카오 인증 페이지로 리다이렉트: {}", kakaoAuthUrl);
        return "redirect:" + kakaoAuthUrl;
    }

    /**
     * 카카오 인가 코드 콜백 처리
     * → 토큰 교환 → 사용자 정보 조회 → JWT 발급 → 프론트엔드로 리다이렉트
     */
    @GetMapping("/login/oauth2/code/kakao")
    public String kakaoCallback(@RequestParam("code") String code) {
        log.info("카카오 콜백 - code: {}", code);

        try {
            LoginResponseDTO loginResponse = oAuthService.kakaoLogin(code);

            String redirectUrl = frontendUrl + "/oauth/callback"
                    + "?accessToken=" + URLEncoder.encode(loginResponse.getAccessToken(), StandardCharsets.UTF_8)
                    + "&refreshToken=" + URLEncoder.encode(loginResponse.getRefreshToken(), StandardCharsets.UTF_8)
                    + "&memberNo=" + loginResponse.getMemberNo()
                    + "&memberName=" + URLEncoder.encode(
                            loginResponse.getMemberName() != null ? loginResponse.getMemberName() : "", StandardCharsets.UTF_8)
                    + "&memberNickname=" + URLEncoder.encode(
                            loginResponse.getMemberNickname() != null ? loginResponse.getMemberNickname() : "", StandardCharsets.UTF_8)
                    + "&memberEmail=" + URLEncoder.encode(
                            loginResponse.getMemberEmail() != null ? loginResponse.getMemberEmail() : "", StandardCharsets.UTF_8)
                    + "&loginType=kakao";

            log.info("카카오 로그인 성공 - memberNo: {}, 프론트엔드로 리다이렉트", loginResponse.getMemberNo());
            return "redirect:" + redirectUrl;

        } catch (Exception e) {
            log.error("카카오 로그인 실패", e);
            String errorUrl = frontendUrl + "/oauth/callback?error="
                    + URLEncoder.encode("카카오 로그인에 실패했습니다.", StandardCharsets.UTF_8);
            return "redirect:" + errorUrl;
        }
    }

    /**
     * 네이버 인증 페이지로 리다이렉트
     */
    @GetMapping("/oauth2/authorization/naver")
    public String redirectToNaver() {
        String state = UUID.randomUUID().toString();

        String naverAuthUrl = "https://nid.naver.com/oauth2.0/authorize"
                + "?client_id=" + naverClientId
                + "&redirect_uri=" + URLEncoder.encode(naverRedirectUri, StandardCharsets.UTF_8)
                + "&response_type=code"
                + "&state=" + state
                + "&auth_type=reprompt";

        log.info("네이버 인증 페이지로 리다이렉트: {}", naverAuthUrl);
        return "redirect:" + naverAuthUrl;
    }

    /**
     * 네이버 인가 코드 콜백 처리
     * → 토큰 교환 → 사용자 정보 조회 → JWT 발급 → 프론트엔드로 리다이렉트
     */
    @GetMapping("/login/oauth2/code/naver")
    public String naverCallback(@RequestParam("code") String code,
                                @RequestParam("state") String state) {
        log.info("네이버 콜백 - code: {}, state: {}", code, state);

        try {
            LoginResponseDTO loginResponse = oAuthService.naverLogin(code, state);

            String redirectUrl = frontendUrl + "/oauth/callback"
                    + "?accessToken=" + URLEncoder.encode(loginResponse.getAccessToken(), StandardCharsets.UTF_8)
                    + "&refreshToken=" + URLEncoder.encode(loginResponse.getRefreshToken(), StandardCharsets.UTF_8)
                    + "&memberNo=" + loginResponse.getMemberNo()
                    + "&memberName=" + URLEncoder.encode(
                            loginResponse.getMemberName() != null ? loginResponse.getMemberName() : "", StandardCharsets.UTF_8)
                    + "&memberNickname=" + URLEncoder.encode(
                            loginResponse.getMemberNickname() != null ? loginResponse.getMemberNickname() : "", StandardCharsets.UTF_8)
                    + "&memberEmail=" + URLEncoder.encode(
                            loginResponse.getMemberEmail() != null ? loginResponse.getMemberEmail() : "", StandardCharsets.UTF_8)
                    + "&loginType=naver";

            log.info("네이버 로그인 성공 - memberNo: {}, 프론트엔드로 리다이렉트", loginResponse.getMemberNo());
            return "redirect:" + redirectUrl;

        } catch (Exception e) {
            log.error("네이버 로그인 실패", e);
            String errorUrl = frontendUrl + "/oauth/callback?error="
                    + URLEncoder.encode("네이버 로그인에 실패했습니다.", StandardCharsets.UTF_8);
            return "redirect:" + errorUrl;
        }
    }

    /**
     * 구글 인증 페이지로 리다이렉트
     */
    @GetMapping("/oauth2/authorization/google")
    public String redirectToGoogle() {
        String googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + googleClientId
                + "&redirect_uri=" + URLEncoder.encode(googleRedirectUri, StandardCharsets.UTF_8)
                + "&response_type=code"
                + "&scope=" + URLEncoder.encode("openid email profile", StandardCharsets.UTF_8)
                + "&access_type=offline"
                + "&prompt=select_account";

        log.info("구글 인증 페이지로 리다이렉트: {}", googleAuthUrl);
        return "redirect:" + googleAuthUrl;
    }

    /**
     * 구글 인가 코드 콜백 처리
     * → 토큰 교환 → 사용자 정보 조회 → JWT 발급 → 프론트엔드로 리다이렉트
     */
    @GetMapping("/login/oauth2/code/google")
    public String googleCallback(@RequestParam("code") String code) {
        log.info("구글 콜백 - code: {}", code);

        try {
            LoginResponseDTO loginResponse = oAuthService.googleLogin(code);

            String redirectUrl = frontendUrl + "/oauth/callback"
                    + "?accessToken=" + URLEncoder.encode(loginResponse.getAccessToken(), StandardCharsets.UTF_8)
                    + "&refreshToken=" + URLEncoder.encode(loginResponse.getRefreshToken(), StandardCharsets.UTF_8)
                    + "&memberNo=" + loginResponse.getMemberNo()
                    + "&memberName=" + URLEncoder.encode(
                            loginResponse.getMemberName() != null ? loginResponse.getMemberName() : "", StandardCharsets.UTF_8)
                    + "&memberNickname=" + URLEncoder.encode(
                            loginResponse.getMemberNickname() != null ? loginResponse.getMemberNickname() : "", StandardCharsets.UTF_8)
                    + "&memberEmail=" + URLEncoder.encode(
                            loginResponse.getMemberEmail() != null ? loginResponse.getMemberEmail() : "", StandardCharsets.UTF_8)
                    + "&loginType=google";

            log.info("구글 로그인 성공 - memberNo: {}, 프론트엔드로 리다이렉트", loginResponse.getMemberNo());
            return "redirect:" + redirectUrl;

        } catch (Exception e) {
            log.error("구글 로그인 실패", e);
            String errorUrl = frontendUrl + "/oauth/callback?error="
                    + URLEncoder.encode("구글 로그인에 실패했습니다.", StandardCharsets.UTF_8);
            return "redirect:" + errorUrl;
        }
    }

    /**
     * 카카오 로그아웃 (세션 만료)
     */
    @PostMapping("/api/oauth/kakao/logout")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> kakaoLogout(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.replace("Bearer ", "");
            int memberNo = jwtUtil.getMemberNo(token);
            oAuthService.kakaoLogout(memberNo);
            response.put("success", true);
            response.put("message", "카카오 로그아웃이 완료되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.warn("카카오 로그아웃 처리 중 오류 (best-effort)", e);
            response.put("success", true);
            response.put("message", "카카오 로그아웃 처리 완료 (일부 오류 무시).");
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 네이버 로그아웃 (토큰 삭제)
     */
    @PostMapping("/api/oauth/naver/logout")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> naverLogout(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.replace("Bearer ", "");
            int memberNo = jwtUtil.getMemberNo(token);
            oAuthService.naverLogout(memberNo);
            response.put("success", true);
            response.put("message", "네이버 로그아웃이 완료되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.warn("네이버 로그아웃 처리 중 오류 (best-effort)", e);
            response.put("success", true);
            response.put("message", "네이버 로그아웃 처리 완료 (일부 오류 무시).");
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 구글 로그아웃 (토큰 취소)
     */
    @PostMapping("/api/oauth/google/logout")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> googleLogout(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            String token = authHeader.replace("Bearer ", "");
            int memberNo = jwtUtil.getMemberNo(token);
            oAuthService.googleLogout(memberNo);
            response.put("success", true);
            response.put("message", "구글 로그아웃이 완료되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.warn("구글 로그아웃 처리 중 오류 (best-effort)", e);
            response.put("success", true);
            response.put("message", "구글 로그아웃 처리 완료 (일부 오류 무시).");
            return ResponseEntity.ok(response);
        }
    }
}
