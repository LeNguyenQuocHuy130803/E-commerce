package com.example.backend_Ecom.controller;

import com.example.backend_Ecom.dto.BlogRequestDto;
import com.example.backend_Ecom.dto.BlogResponseDto;
import com.example.backend_Ecom.dto.BlogReviewRequestDto;
import com.example.backend_Ecom.dto.BlogUpdateRequestDto;
import com.example.backend_Ecom.dto.MessageResponseDto;
import com.example.backend_Ecom.dto.PaginatedBlogResponseDto;
import com.example.backend_Ecom.service.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

import java.security.Principal;
import java.util.List;
import org.springframework.http.MediaType;

@Tag(name = "Blog", description = "Blog operations - CRUD and pagination")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/blogs")
public class BlogController {

    private final BlogService blogService;

    /**
     * LẤY DANH SÁCH BLOG (PHÂN TRANG)
     * Lúc này dữ liệu trả về đã có sẵn điểm sao và số bình luận (Rất nhanh)
     */
    @GetMapping
    public ResponseEntity<PaginatedBlogResponseDto> getAllBlogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(blogService.getAllBlogsPaginated(page, size));
    }

    /**
     * GET /api/blogs/{id}
     * Get blog post by ID
     * Frontend: Lấy chi tiết một bài viết blog
     */
    @Operation(summary = "Get blog post by ID")
    @GetMapping("/{id}")
    public ResponseEntity<BlogResponseDto> getBlogById(
            @Parameter(description = "Blog post ID") @PathVariable @Min(1) Long id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }

    /**
     * GET /api/blogs/all/list
     * Get all blog posts (non-paginated)
     * Used for dropdowns or when all data needed at once
     */
    @Operation(summary = "Get all blog posts without pagination")
    @GetMapping("/all/list")
    public ResponseEntity<List<BlogResponseDto>> getAllBlogsNoPagination() {
        return ResponseEntity.ok(blogService.getAllBlogs());
    }

    /**
     * TẠO BÀI VIẾT MỚI
     * Dùng ModelAttribute để hỗ trợ upload File (Multipart)
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogResponseDto> createBlog(
            @Valid @ModelAttribute BlogRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(blogService.createBlog(request));
    }

    /**
     * CẬP NHẬT BÀI VIẾT (PATCH)
     */
    @PatchMapping("/{id}")
    public ResponseEntity<BlogResponseDto> updateBlog(
            @PathVariable Long id,
            @ModelAttribute BlogUpdateRequestDto request) {
        return ResponseEntity.ok(blogService.updateBlog(id, request));
    }

    /**
     * XÓA BÀI VIẾT
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponseDto> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok(new MessageResponseDto(true, "Bài viết đã được xóa vĩnh viễn"));
    }

    /**
     * API GỬI ĐÁNH GIÁ (RATING & COMMENT)
     * Bảo mật: Dùng Principal để lấy email người dùng từ JWT Token
     */
    @Operation(summary = "Gửi đánh giá và số sao cho bài viết")
    @PostMapping("/{id}/reviews")
    public ResponseEntity<BlogResponseDto> addReview(
            @PathVariable Long id,
            @Valid @RequestBody BlogReviewRequestDto request,
            Principal principal) {

        // principal.getName() sẽ trả về email/username của thằng đang login
        return ResponseEntity.ok(blogService.addReview(id, principal.getName(), request));
    }
}
