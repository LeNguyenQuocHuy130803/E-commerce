package com.example.backend_Ecom.service;

import com.example.backend_Ecom.dto.BlogRequestDto;
import com.example.backend_Ecom.dto.BlogResponseDto;
import com.example.backend_Ecom.dto.BlogReviewRequestDto;
import com.example.backend_Ecom.dto.BlogUpdateRequestDto;
import com.example.backend_Ecom.dto.PaginatedBlogResponseDto;
import com.example.backend_Ecom.entity.Blog;
import com.example.backend_Ecom.entity.BlogReview;
import com.example.backend_Ecom.entity.User;
import com.example.backend_Ecom.exception.AppException;
import com.example.backend_Ecom.exception.ErrorCode;
import com.example.backend_Ecom.repository.BlogRepository;
import com.example.backend_Ecom.repository.BlogReviewRepository;
import com.example.backend_Ecom.repository.UserJpaRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for blog operations
 * Handles CRUD operations and pagination for blog posts
 */
@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class BlogService {

    private final BlogRepository blogRepository;
    private final FileUploadService fileUploadService;
    private final BlogReviewRepository reviewRepository; // Repository mới để quản lý Review
    private final UserJpaRepository userJpaRepository; // Để tìm User từ Token

    /**
     * Create a new blog post
     * 
     * @param request BlogRequestDto containing blog post details
     * @return BlogResponseDto with created blog post
     */
    public BlogResponseDto createBlog(BlogRequestDto request) {
        if (blogRepository.existsByTitle(request.getTitle())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Tiêu đề bài viết đã tồn tại");
        }

        // Tách logic xử lý ảnh ra hàm riêng cho sạch code
        String avatarUrl = handleImageUpload(request.getAvatar(), request.getAvatarUrl());

        Blog blog = Blog.builder()
                .title(request.getTitle())
                .summary(request.getSummary())
                .content(request.getContent())
                .author(request.getAuthor())
                .category(request.getCategory())
                .avatar(avatarUrl)
                .averageRating(0.0) // Mặc định mới tạo là 0 sao
                .reviewCount(0) // 0 lượt đánh giá
                .build();

        return mapToDto(blogRepository.save(blog));
    }

    /**
     * Update an existing blog post
     * 
     * @param id      Blog post ID
     * @param request BlogRequestDto containing updated blog post details
     * @return BlogResponseDto with updated blog post
     */
    @Transactional
    public BlogResponseDto updateBlog(Long id, BlogUpdateRequestDto request) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));

        // Xử lý xoay vòng ảnh: Upload ảnh mới thành công -> Xóa ảnh cũ trên Cloudinary
        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            String oldUrl = blog.getAvatar();
            blog.setAvatar(fileUploadService.uploadImage(request.getAvatar()));
            if (oldUrl != null)
                fileUploadService.deleteImage(oldUrl);
        }

        if (request.getTitle() != null)
            blog.setTitle(request.getTitle());
        if (request.getSummary() != null)
            blog.setSummary(request.getSummary());
        if (request.getContent() != null)
            blog.setContent(request.getContent());
        if (request.getCategory() != null)
            blog.setCategory(request.getCategory());

        return mapToDto(blogRepository.save(blog));
    }

    // Helper method để code nhìn gọn hơn
    private String handleImageUpload(MultipartFile file, String fallbackUrl) {
        if (file != null && !file.isEmpty()) {
            return fileUploadService.uploadImage(file);
        }
        return fallbackUrl;
    }

    /**
     * Delete a blog post
     * 
     * @param id Blog post ID
     */
    @Transactional
    public void deleteBlog(Long id) {
        log.info("Deleting blog post: {}", id);

        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST, "Blog post not found"));

        blogRepository.delete(blog);
        blogRepository.flush();

        // Delete image from Cloudinary only after DB commit succeeds
        if (blog.getAvatar() != null && !blog.getAvatar().isEmpty()) {
            try {
                fileUploadService.deleteImage(blog.getAvatar());
            } catch (RuntimeException e) {
                log.warn("⚠️ Blog {} deleted but Cloudinary image deletion failed: {}", id, e.getMessage());
                // Don't fail - DB deletion already succeeded
            }
        }

        log.info("✓ Blog deleted successfully: {}", id);
    }

    /**
     * Get blog post by ID
     * 
     * @param id Blog post ID
     * @return BlogResponseDto
     */
    public BlogResponseDto getBlogById(Long id) {
        log.info("Fetching blog post: {}", id);

        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST, "Blog post not found"));

        return mapToDto(blog);
    }

    /**
     * Get all blog posts with pagination
     * 
     * @param page Page number (1-based)
     * @param size Number of items per page
     * @return PaginatedBlogResponseDto
     */
    public PaginatedBlogResponseDto getAllBlogsPaginated(int page, int size) {
        log.info("Fetching all blog posts - page: {}, size: {}", page, size);

        // Validate and normalize pagination parameters
        if (page < 1)
            page = 1;
        if (size < 1)
            size = 10;

        // Convert 1-based page to 0-based for Spring Data
        Pageable pageable = PageRequest.of(page - 1, size);

        // Get paginated data from repository
        Page<Blog> blogPage = blogRepository.findAll(pageable);

        // Convert Page<Blog> to List<BlogResponseDto>
        List<BlogResponseDto> blogDtos = blogPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        // Build response with pagination info (convert back to 1-based)
        return PaginatedBlogResponseDto.builder()
                .data(blogDtos)
                .pageNumber(blogPage.getNumber() + 1) // Convert back to 1-based
                .pageSize(blogPage.getSize())
                .totalRecords(blogPage.getTotalElements())
                .totalPages(blogPage.getTotalPages())
                .hasNext(blogPage.hasNext())
                .hasPrevious(blogPage.hasPrevious())
                .build();
    }

    /**
     * Get all blog posts (non-paginated)
     * 
     * @return List of BlogResponseDto
     */
    public List<BlogResponseDto> getAllBlogs() {
        log.info("Fetching all blog posts (non-paginated)");

        return blogRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * THÊM ĐÁNH GIÁ (REVIEW & RATING)
     * Đây là hàm quan trọng nhất mới thêm vào.
     */
    public BlogResponseDto addReview(Long blogId, String userEmail, BlogReviewRequestDto request) {
        log.info("User {} is adding a review for blog ID: {}", userEmail, blogId);

        // 1. Kiểm tra Blog có tồn tại không
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy bài viết"));

        // 2. Lấy thông tin User từ Email (lấy từ Token)
        User user = userJpaRepository.findByEmail(userEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 3. CHỐNG SPAM: Mỗi User chỉ được đánh giá 1 bài blog 1 lần duy nhất
        if (reviewRepository.existsByBlogIdAndUserId(blogId, user.getId())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Bạn đã đánh giá bài viết này rồi");
        }

        // 4. Lưu Review mới (Gộp chung content và số sao)
        BlogReview review = BlogReview.builder()
                .blog(blog)
                .user(user)
                .content(request.getContent())
                .rating(request.getRating())
                .build();
        reviewRepository.save(review);

        // 5. CẬP NHẬT RATING (Kỹ thuật Denormalization)
        // Thay vì COUNT/AVG trong DB mỗi lần load, ta tính toán và lưu trực tiếp kết
        // quả vào bảng Blog
        updateBlogStatistics(blog, request.getRating());

        return mapToDto(blogRepository.save(blog));
    }

    /**
     * Logic tính toán điểm trung bình mới
     * Công thức: $$NewAvg = \frac{(OldAvg \times OldCount) + NewStars}{OldCount +
     * 1}$$
     */
    private void updateBlogStatistics(Blog blog, Integer newRating) {
        int oldCount = blog.getReviewCount();
        double currentAvg = blog.getAverageRating();

        int newCount = oldCount + 1;
        double newAvg = ((currentAvg * oldCount) + newRating) / newCount;

        blog.setReviewCount(newCount);
        blog.setAverageRating(Math.round(newAvg * 10.0) / 10.0); // Làm tròn 1 chữ số thập phân (VD: 4.8)
    }

    /**
     * Map Blog entity to BlogResponseDto
     * 
     * @param blog Blog entity
     * @return BlogResponseDto
     */
    private BlogResponseDto mapToDto(Blog blog) {
        return BlogResponseDto.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .summary(blog.getSummary())
                .content(blog.getContent())
                .avatar(blog.getAvatar())
                .author(blog.getAuthor())
                .category(blog.getCategory())
                .averageRating(blog.getAverageRating())
                .reviewCount(blog.getReviewCount())
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .build();
    }
}
