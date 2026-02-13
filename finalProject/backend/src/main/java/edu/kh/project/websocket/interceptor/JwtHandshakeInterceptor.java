package edu.kh.project.websocket.interceptor;

import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import edu.kh.project.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * WebSocket 핸드셰이크 인터셉터
 * - SockJS 연결 URL의 ?token=xxx 쿼리 파라미터에서 JWT 추출
 * - 수업 코드의 SessionHandshakeInterceptor를 JWT 방식으로 대체
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {

        // 쿼리 파라미터에서 token 추출
        String query = request.getURI().getQuery();
        String token = null;

        if (query != null) {
            Map<String, String> params = UriComponentsBuilder.newInstance()
                    .query(query).build().getQueryParams().toSingleValueMap();
            token = params.get("token");
        }

        if (token != null && jwtUtil.validateToken(token)) {
            int memberNo = jwtUtil.getMemberNo(token);
            attributes.put("memberNo", memberNo);
            log.info("WebSocket 핸드셰이크 성공 - memberNo: {}", memberNo);
            return true;
        }

        log.warn("WebSocket 핸드셰이크 실패 - 유효하지 않은 토큰");
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // 후처리 필요 없음
    }
}
