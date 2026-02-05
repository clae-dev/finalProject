package edu.kh.project.accommodation.dto;

import lombok.Data;
import java.util.List;

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
        private String MNG_NO;          // 관리번호
        private String BPLC_NM;         // 사업장명
        private String ROAD_NM_ADDR;    // 도로명주소
        private String LOTNO_ADDR;      // 지번주소
        private String TELNO;           // 전화번호
        private String GSRM_CNT;        // 객실수
        private String SALS_STTS_NM;    // 영업상태
        private String CRD_INFO_X;      // X좌표
        private String CRD_INFO_Y;      // Y좌표
    }
}