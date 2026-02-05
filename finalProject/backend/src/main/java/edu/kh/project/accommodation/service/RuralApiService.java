package edu.kh.project.accommodation.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import edu.kh.project.accommodation.dto.RuralApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 농촌민박 API 호출 서비스
 * - 외부 API 호출만 담당
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RuralApiService {
    
    private final RestTemplate restTemplate;
    
    @Value("${rural.api.key}")
    private String apiKey;
    
    @Value("${rural.api.url}")
    private String apiUrl;
    
    /**
     * 농촌민박 데이터 조회
     * @param pageNo 페이지 번호
     * @param numOfRows 한 페이지 결과 수
     * @return API 응답
     */
    public RuralApiResponse getRuralAccommodations(int pageNo, int numOfRows) {
        
        log.info("===== 농촌민박 API 호출 =====");
        log.info("Page: {}, Rows: {}", pageNo, numOfRows);
        
        String url = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("serviceKey", apiKey)
                .queryParam("numOfRows", numOfRows)
                .queryParam("pageNo", pageNo)
                .queryParam("type", "json")
                .build()
                .encode()
                .toUriString();
        
        try {
            RuralApiResponse response = restTemplate.getForObject(url, RuralApiResponse.class);
            
            if (response != null && response.getResponse() != null) {
                log.info("API 호출 성공 - 결과 코드: {}", 
                    response.getResponse().getHeader().getResultCode());
                log.info("총 데이터 수: {}", 
                    response.getResponse().getBody().getTotalCount());
            }
            
            return response;
            
        } catch (Exception e) {
            log.error("API 호출 실패: {}", e.getMessage(), e);
            throw new RuntimeException("농촌민박 API 호출 중 오류 발생", e);
        }
    }
}