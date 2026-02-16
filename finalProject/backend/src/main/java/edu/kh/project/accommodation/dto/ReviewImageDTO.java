package edu.kh.project.accommodation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewImageDTO {

    private int imageNo;
    private int reviewNo;
    private String imageUrl;
    private String originalName;
    private String renamedName;
    private int imageOrder;
}
