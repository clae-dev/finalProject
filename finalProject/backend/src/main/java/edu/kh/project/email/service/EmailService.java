package edu.kh.project.email.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 이메일 인증 서비스
 * - 인증 코드 생성, 발송, 검증
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

        mailSender.send(message);
    }

    /**
     * 이메일 HTML 컨텐츠 생성
     * @param code 인증 코드
     * @return HTML 문자열
     */
    private String buildEmailContent(String code) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Malgun Gothic', Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(to right, #38bdf8, #22d3ee); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .header h1 { color: white; margin: 0; font-size: 28px; }
                    .content { background: #f8fafc; padding: 40px; border-radius: 0 0 10px 10px; }
                    .code-box { background: white; border: 2px solid #38bdf8; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
                    .code { font-size: 36px; font-weight: bold; color: #0ea5e9; letter-spacing: 8px; }
                    .info { color: #64748b; font-size: 14px; margin-top: 20px; }
                    .warning { color: #ef4444; font-size: 12px; margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>HONDI 이메일 인증</h1>
                    </div>
                    <div class="content">
                        <p>안녕하세요! HONDI 회원가입을 위한 인증 코드입니다.</p>
                        <div class="code-box">
                            <div class="code">%s</div>
                        </div>
                        <p class="info">위 인증 코드를 회원가입 페이지에 입력해주세요.</p>
                        <p class="warning">* 이 코드는 3분 후 만료됩니다.</p>
                        <p class="warning">* 본인이 요청하지 않은 경우 이 이메일을 무시해주세요.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(code);
    }
}
