package edu.kh.project.websocket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import edu.kh.project.websocket.handler.ChattingWebSocketHandler;
import edu.kh.project.websocket.handler.NotificationWebSocketHandler;
import edu.kh.project.websocket.interceptor.JwtHandshakeInterceptor;
import lombok.RequiredArgsConstructor;

/**
 * WebSocket 설정 클래스
 *
 * <p>SockJS 기반 WebSocket 엔드포인트를 등록하고
 * JWT 핸드셰이크 인터셉터를 적용한다.</p>
 *
 * <ul>
 *   <li><b>/chattingSock</b> – 1:1 실시간 채팅용</li>
 *   <li><b>/notificationSock</b> – 실시간 알림 push용</li>
 * </ul>
 *
 * @author HONDI
 */
@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChattingWebSocketHandler chattingWebSocketHandler;
    private final NotificationWebSocketHandler notificationWebSocketHandler;
    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;

    /** {@inheritDoc} – 채팅/알림 WebSocket 핸들러 등록 */
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chattingWebSocketHandler, "/chattingSock")
                .addInterceptors(jwtHandshakeInterceptor)
                .setAllowedOriginPatterns("*")
                .withSockJS();

        registry.addHandler(notificationWebSocketHandler, "/notificationSock")
                .addInterceptors(jwtHandshakeInterceptor)
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
