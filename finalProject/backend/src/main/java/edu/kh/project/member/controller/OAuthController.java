package edu.kh.project.member.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import edu.kh.project.member.dto.LoginResponseDTO;
import edu.kh.project.member.service.OAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class OAuthController {

    private final OAuthService oAuthService;

    @Value("${kakao.client.id}")
    private String kakaoClientId;

    @Value("${kakao.redirect.uri}")
    private String kakaoRedirectUri;

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
                + "&response_type=code";

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
                            loginResponse.getMemberEmail() != null ? loginResponse.getMemberEmail() : "", StandardCharsets.UTF_8);

            log.info("카카오 로그인 성공 - memberNo: {}, 프론트엔드로 리다이렉트", loginResponse.getMemberNo());
            return "redirect:" + redirectUrl;

        } catch (Exception e) {
            log.error("카카오 로그인 실패", e);
            String errorUrl = frontendUrl + "/oauth/callback?error="
                    + URLEncoder.encode("카카오 로그인에 실패했습니다.", StandardCharsets.UTF_8);
            return "redirect:" + errorUrl;
        }
    }
}
