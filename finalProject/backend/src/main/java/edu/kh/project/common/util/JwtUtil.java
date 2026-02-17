package edu.kh.project.common.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT(JSON Web Token) 토큰 생성 및 검증 유틸리티
 *
 * <p>HMAC SHA256 알고리즘을 사용하여 JWT 토큰을 생성하고,
 * 토큰에서 회원 정보를 추출하거나 유효성을 검증하는 기능을 제공한다.</p>
 *
 * <h3>토큰 종류</h3>
 * <ul>
 *   <li><b>Access Token</b> - API 인증용 (기본 유효시간: 30분)
 *       <br>Claims: memberNo(subject), email, role, type=ACCESS</li>
 *   <li><b>Refresh Token</b> - Access Token 재발급용 (기본 유효시간: 7일)
 *       <br>Claims: memberNo(subject), type=REFRESH</li>
 * </ul>
 *
 * <p>{@link edu.kh.project.common.config.JwtConfig}에서 Bean으로 등록되며,
 * config.properties의 JWT 설정값을 사용한다.</p>
 *
 * @author HONDI
 * @see edu.kh.project.common.config.JwtConfig
 */
public class JwtUtil {

    /** HMAC SHA256 서명용 비밀키 */
    private final SecretKey secretKey;

    /** Access Token 유효시간 (밀리초, 기본 1800000ms = 30분) */
    private final long accessTokenValidity;

    /** Refresh Token 유효시간 (밀리초, 기본 604800000ms = 7일) */
    private final long refreshTokenValidity;

    /**
     * JwtUtil을 초기화한다.
     *
     * <p>{@link edu.kh.project.common.config.JwtConfig}에서 config.properties의
     * 설정값을 읽어 이 생성자를 호출한다.</p>
     *
     * @param secret              JWT 서명용 비밀키 문자열
     * @param accessTokenValidity Access Token 유효시간 (밀리초)
     * @param refreshTokenValidity Refresh Token 유효시간 (밀리초)
     */
    public JwtUtil(String secret, long accessTokenValidity, long refreshTokenValidity) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenValidity = accessTokenValidity;
        this.refreshTokenValidity = refreshTokenValidity;
    }

    // ==================== 토큰 생성 ====================

    /**
     * Access Token을 생성한다.
     *
     * <p>회원 번호, 이메일, 권한 정보를 Claims에 포함하며,
     * 토큰 타입은 "ACCESS"로 설정한다.</p>
     *
     * @param memberNo 회원 번호 (subject로 저장)
     * @param email    회원 이메일
     * @param role     권한 (ROLE_USER, ROLE_ADMIN)
     * @return 생성된 JWT Access Token 문자열
     */
    public String generateAccessToken(int memberNo, String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessTokenValidity);

        return Jwts.builder()
                .subject(String.valueOf(memberNo))
                .claim("email", email)
                .claim("role", role)
                .claim("type", "ACCESS")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    /**
     * Refresh Token을 생성한다.
     *
     * <p>회원 번호만 Claims에 포함하며, 토큰 타입은 "REFRESH"로 설정한다.
     * Access Token이 만료되었을 때 새로운 Access Token을 발급받는 데 사용된다.</p>
     *
     * @param memberNo 회원 번호 (subject로 저장)
     * @return 생성된 JWT Refresh Token 문자열
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

    // ==================== 토큰 정보 추출 ====================

    /**
     * JWT 토큰에서 회원 번호를 추출한다.
     *
     * @param token JWT 토큰 문자열
     * @return 토큰의 subject에 저장된 회원 번호
     * @throws JwtException 토큰이 유효하지 않을 경우
     */
    public int getMemberNo(String token) {
        Claims claims = parseClaims(token);
        return Integer.parseInt(claims.getSubject());
    }

    /**
     * JWT 토큰에서 이메일을 추출한다.
     *
     * @param token JWT 토큰 문자열
     * @return 토큰의 "email" 클레임 값
     * @throws JwtException 토큰이 유효하지 않을 경우
     */
    public String getEmail(String token) {
        Claims claims = parseClaims(token);
        return claims.get("email", String.class);
    }

    /**
     * JWT 토큰에서 권한(role)을 추출한다.
     *
     * @param token JWT 토큰 문자열
     * @return 토큰의 "role" 클레임 값 (ROLE_USER 또는 ROLE_ADMIN)
     * @throws JwtException 토큰이 유효하지 않을 경우
     */
    public String getRole(String token) {
        Claims claims = parseClaims(token);
        return claims.get("role", String.class);
    }

    // ==================== 토큰 검증 ====================

    /**
     * JWT 토큰의 유효성을 검증한다.
     *
     * <p>서명, 만료 시간, 토큰 형식 등을 검사하여
     * 유효한 토큰인지 판별한다.</p>
     *
     * @param token 검증할 JWT 토큰 문자열
     * @return 유효하면 {@code true}, 그 외 {@code false}
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
            // 지원하지 않는 JWT 형식
            return false;
        } catch (IllegalArgumentException e) {
            // JWT 문자열이 비어있음
            return false;
        }
    }

    /**
     * JWT 토큰의 만료 여부를 확인한다.
     *
     * @param token 확인할 JWT 토큰 문자열
     * @return 만료되었으면 {@code true}, 아직 유효하면 {@code false}
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = parseClaims(token);
            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    // ==================== 내부 헬퍼 ====================

    /**
     * JWT 토큰을 파싱하여 Claims(페이로드)를 추출한다.
     *
     * @param token JWT 토큰 문자열
     * @return 파싱된 Claims 객체
     * @throws JwtException 토큰 파싱 실패 시
     */
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
