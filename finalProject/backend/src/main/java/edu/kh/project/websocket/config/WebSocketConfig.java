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
 * WebSocket 설정
 * - /chattingSock 엔드포인트에 SockJS 지원
 * - /notificationSock 알림 전용 엔드포인트
 */
@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChattingWebSocketHandler chattingWebSocketHandler;
    private final NotificationWebSocketHandler notificationWebSocketHandler;
    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;

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
