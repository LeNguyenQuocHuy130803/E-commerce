package com.example.backend_Ecom.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Schema(description = "DTO for blog post partial update (PATCH)")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogUpdateRequestDto {

    private String title;

    private String summary;  // Short description for list page

    private String content;  // Full HTML content for detail page

    private String author;

    private String category;  // Recipes, Tips, News, etc.

    // Upload avatar file (optional)
    private MultipartFile avatar;

    // Or use avatar URL directly (optional)
    private String avatarUrl;

}
