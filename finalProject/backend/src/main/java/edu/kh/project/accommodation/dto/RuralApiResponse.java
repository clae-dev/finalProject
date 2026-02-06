package edu.kh.project.accommodation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

/**
 * 농촌민박 API 응답 DTO
 */
@Data
public class RuralApiResponse {
    
    private Response response;
    
    @Data
    public static class Response {
        private Header header;
        private Body body;
    }
    
    @Data
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }
    
    @Data
    public static class Body {
        private Items items;
        private int numOfRows;
        private int pageNo;
        private int totalCount;
    }
    
    @Data
    public static class Items {
        private List<Item> item;
    }
    
    @Data
    public static class Item {
        
        @JsonProperty("MNG_NO")
        private String MNG_NO;          // 관리번호
        
        @JsonProperty("BPLC_NM")
        private String BPLC_NM;         // 사업장명
        
        @JsonProperty("ROAD_NM_ADDR")
        private String ROAD_NM_ADDR;    // 도로명주소
        
        @JsonProperty("LOTNO_ADDR")
        private String LOTNO_ADDR;      // 지번주소
        
        @JsonProperty("TELNO")
        private String TELNO;           // 전화번호
        
        @JsonProperty("GSRM_CNT")
        private String GSRM_CNT;        // 객실수
        
        @JsonProperty("SALS_STTS_NM")
        private String SALS_STTS_NM;    // 영업상태명
        
        @JsonProperty("CRD_INFO_X")
        private String CRD_INFO_X;      // X좌표
        
        @JsonProperty("CRD_INFO_Y")
        private String CRD_INFO_Y;      // Y좌표
        
        // ✅ 업종 분류 관련 필드 추가
        @JsonProperty("INDUTY_NM")
        private String INDUTY_NM;       // 업종명
        
        @JsonProperty("BSN_STATE_NM")
        private String BSN_STATE_NM;    // 업태구분명
        
        @JsonProperty("DTL_STTS_NM")
        private String DTL_STTS_NM;     // 상세영업상태명
        
        @JsonProperty("SANITAR_INDUTY_TYPE_NM")
        private String SANITAR_INDUTY_TYPE_NM;  // 위생업종명
    }
}