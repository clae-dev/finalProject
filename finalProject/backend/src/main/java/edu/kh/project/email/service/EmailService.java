package edu.kh.project.email.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 이메일 인증 서비스
 *
 * <p>6자리 인증 코드 생성, JavaMailSender를 통한 HTML 이메일 발송,
 * ConcurrentHashMap 기반 인증 코드 저장 및 3분 만료 검증 로직을 구현한다.</p>
 *
 * @author HONDI
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    // 인증 코드 저장소 (이메일 -> 인증 정보)
    private final Map<String, VerificationCode> codeStorage = new ConcurrentHashMap<>();

    // 인증 코드 유효 시간 (3분)
    private static final long CODE_EXPIRATION_MINUTES = 3;

    /**
     * 인증 코드 정보를 담는 내부 클래스
     */
    private static class VerificationCode {
        private final String code;
        private final LocalDateTime expiresAt;

        public VerificationCode(String code, long expirationMinutes) {
            this.code = code;
            this.expiresAt = LocalDateTime.now().plusMinutes(expirationMinutes);
        }

        public String getCode() {
            return code;
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiresAt);
        }
    }

    /**
     * 인증 코드 생성 및 이메일 발송
     * @param email 수신자 이메일
     * @throws MessagingException 이메일 발송 실패 시
     */
    public void sendVerificationCode(String email) throws MessagingException {
        // 6자리 인증 코드 생성
        String code = generateCode();

        // 코드 저장 (3분 만료)
        codeStorage.put(email, new VerificationCode(code, CODE_EXPIRATION_MINUTES));

        // 이메일 발송
        sendEmail(email, code);

        log.info("인증 코드 발송 완료: {} -> {}", email, code);
    }

    /**
     * 인증 코드 검증
     * @param email 이메일
     * @param code 입력된 인증 코드
     * @return 검증 성공 여부
     */
    public boolean verifyCode(String email, String code) {
        VerificationCode saved = codeStorage.get(email);

        // 저장된 코드가 없는 경우
        if (saved == null) {
            log.warn("인증 코드 없음: {}", email);
            return false;
        }

        // 코드가 만료된 경우
        if (saved.isExpired()) {
            log.warn("인증 코드 만료: {}", email);
            codeStorage.remove(email);
            return false;
        }

        // 코드 일치 확인
        boolean isValid = saved.getCode().equals(code);

        if (isValid) {
            // 인증 성공 시 코드 삭제
            codeStorage.remove(email);
            log.info("인증 코드 검증 성공: {}", email);
        } else {
            log.warn("인증 코드 불일치: {}", email);
        }

        return isValid;
    }

    /**
     * 6자리 랜덤 인증 코드 생성
     * @return 6자리 숫자 코드
     */
    private String generateCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // 100000 ~ 999999
        return String.valueOf(code);
    }

    /**
     * 이메일 발송
     * @param to 수신자 이메일
     * @param code 인증 코드
     * @throws MessagingException 발송 실패 시
     */
    private void sendEmail(String to, String code) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject("[HONDI] 이메일 인증 코드");

        String htmlContent = buildEmailContent(code);
        helper.setText(htmlContent, true);

        // 로고 이미지를 인라인 첨부 (CID 방식)
        ClassPathResource logoResource = new ClassPathResource("static/images/hondi-logo.png");
        helper.addInline("hondiLogo", logoResource);

        mailSender.send(message);
    }

    /**
     * 이메일 HTML 컨텐츠 생성
     * @param code 인증 코드
     * @return HTML 문자열
     */
    private String buildEmailContent(String code) {
        // 인증 코드를 한 자리씩 분리하여 개별 박스로 표시
        StringBuilder codeBoxes = new StringBuilder();
        for (char digit : code.toCharArray()) {
            codeBoxes.append(String.format(
                "<td style=\"width:50px;height:60px;background:linear-gradient(180deg,#ffffff 0%%,#f0f9ff 100%%);border:2px solid #bae6fd;border-radius:14px;text-align:center;vertical-align:middle;font-size:30px;font-weight:800;color:#0369a1;font-family:'Segoe UI',Arial,sans-serif;letter-spacing:0;box-shadow:0 4px 12px rgba(14,165,233,0.15),inset 0 1px 0 rgba(255,255,255,0.8);\">%c</td>",
                digit
            ));
        }

        return """
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background-color:#e0f2fe;font-family:'Apple SD Gothic Neo','Malgun Gothic','Segoe UI',Arial,sans-serif;">
                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color:#e0f2fe;padding:40px 20px;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%%;box-shadow:0 20px 60px rgba(3,105,161,0.15);border-radius:28px;overflow:hidden;">

                                <!-- 상단 제주 바다 헤더 -->
                                <tr>
                                    <td style="background:linear-gradient(135deg,#0c4a6e 0%%,#0369a1 30%%,#0ea5e9 60%%,#22d3ee 100%%);padding:44px 40px 0;text-align:center;position:relative;">

                                        <!-- 제주 장식 아이콘들 -->
                                        <div style="margin-bottom:16px;">
                                            <span style="font-size:16px;margin:0 6px;opacity:0.6;">&#127796;</span>
                                            <span style="font-size:16px;margin:0 6px;opacity:0.6;">&#127754;</span>
                                            <span style="font-size:16px;margin:0 6px;opacity:0.6;">&#9971;</span>
                                            <span style="font-size:16px;margin:0 6px;opacity:0.6;">&#127754;</span>
                                            <span style="font-size:16px;margin:0 6px;opacity:0.6;">&#127796;</span>
                                        </div>

                                        <!-- 혼디 로고 이미지 -->
                                        <div style="margin-bottom:10px;">
                                            <img src="cid:hondiLogo" alt="HONDI" style="width:80px;height:auto;border-radius:16px;" />
                                        </div>

                                        <!-- 로고 텍스트 -->
                                        <div style="margin-bottom:4px;">
                                            <span style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:6px;font-family:'Segoe UI',Arial,sans-serif;text-shadow:0 2px 8px rgba(0,0,0,0.15);">HONDI</span>
                                        </div>
                                        <div style="font-size:10px;color:rgba(255,255,255,0.65);letter-spacing:8px;margin-bottom:20px;">제주 혼행 커뮤니티</div>

                                        <!-- 구분선 -->
                                        <div style="width:50px;height:2px;background:rgba(255,255,255,0.35);border-radius:1px;margin:0 auto 24px;"></div>

                                        <!-- 메일 아이콘 -->
                                        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 18px;">
                                            <tr>
                                                <td style="width:56px;height:56px;background:rgba(255,255,255,0.15);border-radius:50%%;text-align:center;vertical-align:middle;border:2px solid rgba(255,255,255,0.2);">
                                                    <span style="font-size:24px;">&#9993;&#65039;</span>
                                                </td>
                                            </tr>
                                        </table>

                                        <h1 style="margin:0 0 6px;font-size:22px;font-weight:700;color:#ffffff;text-shadow:0 1px 4px rgba(0,0,0,0.1);">이메일 인증</h1>
                                        <p style="margin:0 0 28px;font-size:13px;color:rgba(255,255,255,0.75);">본인 확인을 위한 인증 코드를 보내드립니다</p>
                                    </td>
                                </tr>

                                <!-- 제주 바다 웨이브 -->
                                <tr>
                                    <td style="padding:0;line-height:0;font-size:0;">
                                        <svg viewBox="0 0 560 40" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%%;">
                                            <defs>
                                                <linearGradient id="waveGrad" x1="0%%" y1="0%%" x2="100%%" y2="0%%">
                                                    <stop offset="0%%" style="stop-color:#0369a1;stop-opacity:1" />
                                                    <stop offset="50%%" style="stop-color:#0ea5e9;stop-opacity:1" />
                                                    <stop offset="100%%" style="stop-color:#22d3ee;stop-opacity:1" />
                                                </linearGradient>
                                            </defs>
                                            <rect width="560" height="40" fill="#ffffff"/>
                                            <path d="M0,20 C70,35 140,5 210,20 C280,35 350,5 420,20 C490,35 530,15 560,20 L560,0 L0,0 Z" fill="url(#waveGrad)"/>
                                            <path d="M0,14 C80,28 160,2 240,14 C320,26 400,4 480,16 C520,22 545,10 560,14 L560,0 L0,0 Z" fill="rgba(255,255,255,0.08)"/>
                                        </svg>
                                    </td>
                                </tr>

                                <!-- 본문 영역 -->
                                <tr>
                                    <td style="background:#ffffff;padding:28px 44px 40px;">

                                        <!-- 인사말 -->
                                        <p style="margin:0 0 8px;font-size:15px;color:#334155;line-height:1.8;">
                                            &#127466;&#127475; 혼저 옵서예!
                                        </p>
                                        <p style="margin:0 0 28px;font-size:14px;color:#475569;line-height:1.8;">
                                            <strong style="color:#0ea5e9;">HONDI</strong>를 이용해 주셔서 감사합니다.<br/>
                                            아래 인증 코드를 입력하여 본인 확인을 완료해주세요.
                                        </p>

                                        <!-- 인증 코드 영역 -->
                                        <div style="background:linear-gradient(145deg,#f0f9ff 0%%,#e0f2fe 50%%,#ecfeff 100%%);border-radius:20px;padding:28px 20px 24px;text-align:center;margin:0 0 24px;border:1px solid #bae6fd;">
                                            <p style="margin:0 0 6px;font-size:11px;color:#64748b;letter-spacing:3px;text-transform:uppercase;font-weight:600;">VERIFICATION CODE</p>
                                            <p style="margin:0 0 14px;font-size:10px;color:#94a3b8;">&#128293; 3분 이내에 입력해주세요</p>
                                            <table role="presentation" cellpadding="0" cellspacing="7" style="margin:0 auto;">
                                                <tr>
                                                    %s
                                                </tr>
                                            </table>
                                            <p style="margin:10px 0 0;font-size:12px;color:#94a3b8;">복사용&nbsp;&#128203;&nbsp;<span style="color:#0369a1;font-weight:700;font-family:'Courier New',monospace;letter-spacing:3px;">%s</span></p>
                                        </div>

                                        <!-- 안내 사항 카드 -->
                                        <div style="background:#f8fafc;border-radius:16px;padding:20px 22px;margin:0 0 24px;border:1px solid #e2e8f0;">
                                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%%">
                                                <tr>
                                                    <td style="width:28px;vertical-align:top;padding-top:1px;">
                                                        <span style="font-size:15px;">&#9200;</span>
                                                    </td>
                                                    <td style="font-size:13px;color:#475569;padding-left:10px;line-height:1.6;">
                                                        인증 코드는 <strong style="color:#0369a1;">3분간</strong> 유효합니다.
                                                    </td>
                                                </tr>
                                                <tr><td colspan="2" style="height:10px;"></td></tr>
                                                <tr>
                                                    <td style="width:28px;vertical-align:top;padding-top:1px;">
                                                        <span style="font-size:15px;">&#128274;</span>
                                                    </td>
                                                    <td style="font-size:13px;color:#475569;padding-left:10px;line-height:1.6;">
                                                        인증 코드는 타인과 공유하지 마세요.
                                                    </td>
                                                </tr>
                                                <tr><td colspan="2" style="height:10px;"></td></tr>
                                                <tr>
                                                    <td style="width:28px;vertical-align:top;padding-top:1px;">
                                                        <span style="font-size:15px;">&#9888;&#65039;</span>
                                                    </td>
                                                    <td style="font-size:13px;color:#475569;padding-left:10px;line-height:1.6;">
                                                        본인이 요청하지 않았다면 이 메일을 무시해주세요.
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>

                                        <!-- 제주 감성 문구 -->
                                        <div style="text-align:center;padding:4px 0 0;">
                                            <div style="width:30px;height:1px;background:#e2e8f0;margin:0 auto 14px;"></div>
                                            <p style="margin:0 0 4px;font-size:13px;color:#0ea5e9;font-weight:600;">
                                                &#127754; 혼자여서 더 자유로운 제주 여행 &#127754;
                                            </p>
                                            <p style="margin:0;font-size:11px;color:#94a3b8;">
                                                제주의 바람과 함께, HONDI가 동행합니다
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                                <!-- 하단 제주 장식 바 -->
                                <tr>
                                    <td style="background:linear-gradient(90deg,#fed7aa,#fdba74,#fb923c,#fdba74,#fed7aa);padding:6px 0;text-align:center;">
                                        <span style="font-size:10px;letter-spacing:12px;color:#9a3412;">&#127818; &#127818; &#127818; &#127818; &#127818;</span>
                                    </td>
                                </tr>

                                <!-- 푸터 -->
                                <tr>
                                    <td style="background:#0f172a;border-radius:0 0 28px 28px;padding:30px 40px;text-align:center;">
                                        <!-- 로고 -->
                                        <div style="margin-bottom:10px;">
                                            <img src="cid:hondiLogo" alt="HONDI" style="width:36px;height:auto;border-radius:8px;opacity:0.9;" />
                                        </div>
                                        <p style="margin:0 0 4px;font-size:15px;font-weight:800;letter-spacing:4px;">
                                            <span style="color:#38bdf8;">HON</span><span style="color:#22d3ee;">DI</span>
                                        </p>
                                        <p style="margin:0 0 14px;font-size:9px;color:#64748b;letter-spacing:5px;">JEJU SOLO TRAVEL COMMUNITY</p>
                                        <div style="width:40px;height:1px;background:#334155;margin:0 auto 14px;"></div>
                                        <p style="margin:0 0 6px;font-size:10px;color:#475569;line-height:1.7;">
                                            이 메일은 HONDI 서비스에서 자동 발송되었습니다.
                                        </p>
                                        <p style="margin:0;font-size:10px;color:#475569;">
                                            &copy; 2025 HONDI. All rights reserved.
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(codeBoxes.toString(), code);
    }
}
