package edu.kh.project.common.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 토큰 생성 및 검증 유틸리티
 * - Access Token: 30분
 * - Refresh Token: 7일
 */
public class JwtUtil {

    private final SecretKey secretKey;
    private final long accessTokenValidity;   // 1800000ms = 30분
    private final long refreshTokenValidity;  // 604800000ms = 7일

    /**
     * JWT 설정값으로 초기화 (JwtConfig에서 호출)
     * @param secret JWT 비밀키
     * @param accessTokenValidity Access Token 유효시간 (밀리초)
     * @param refreshTokenValidity Refresh Token 유효시간 (밀리초)
     */
    public JwtUtil(String secret, long accessTokenValidity, long refreshTokenValidity) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenValidity = accessTokenValidity;
        this.refreshTokenValidity = refreshTokenValidity;
    }

    /**
     * Access Token 생성
     * @param memberNo 회원 번호
     * @param email 이메일
     * @param role 권한 (ROLE_USER, ROLE_ADMIN)
     * @return JWT Access Token
     */
    public String generateAccessToken(int memberNo, String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessTokenValidity);

        return Jwts.builder()
                .subject(String.valueOf(memberNo))      // 회원 번호
                .claim("email", email)                  // 이메일
                .claim("role", role)                    // 권한
                .claim("type", "ACCESS")                // 토큰 타입
                .issuedAt(now)                          // 발행 시간
                .expiration(expiryDate)                 // 만료 시간
                .signWith(secretKey)                    // 서명
                .compact();
    }

    /**
     * Refresh Token 생성
     * @param memberNo 회원 번호
     * @return JWT Refresh Token
     */
    public String generateRefreshToken(int memberNo) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenValidity);

        return Jwts.builder()
                .subject(String.valueOf(memberNo))
                .claim("type", "REFRESH")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    /**
     * JWT 토큰에서 회원 번호 추출
     */
    public int getMemberNo(String token) {
        Claims claims = parseClaims(token);
        return Integer.parseInt(claims.getSubject());
    }

    /**
     * JWT 토큰에서 이메일 추출
     */
    public String getEmail(String token) {
        Claims claims = parseClaims(token);
        return claims.get("email", String.class);
    }

    /**
     * JWT 토큰에서 권한 추출
     */
    public String getRole(String token) {
        Claims claims = parseClaims(token);
        return claims.get("role", String.class);
    }

    /**
     * JWT 토큰 검증
     * @return 유효하면 true
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            // 잘못된 JWT 서명
            return false;
        } catch (ExpiredJwtException e) {
            // 만료된 JWT
            return false;
        } catch (UnsupportedJwtException e) {
            // 지원하지 않는 JWT
            return false;
        } catch (IllegalArgumentException e) {
            // JWT가 비어있음
            return false;
        }
    }

    /**
     * JWT 토큰 파싱
     */
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 토큰 만료 여부 확인
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = parseClaims(token);
            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }
}