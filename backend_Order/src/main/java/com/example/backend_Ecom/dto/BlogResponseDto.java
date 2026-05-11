package com.example.backend_Ecom.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import java.time.LocalDateTime;

@Schema(description = "DTO for blog post response")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogResponseDto {
    private Long id;
    private String title;
    private String summary;
    private String content;
    private String avatar;
    private String author;
    private String category;
    private Double averageRating; // Trả về để vẽ sao ở FE
    private Integer reviewCount;  // Trả về để hiện "24 Bình luận"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}