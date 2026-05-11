package com.example.backend_Ecom.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend_Ecom.entity.BlogReview;

@Repository
public interface BlogReviewRepository extends JpaRepository<BlogReview, Long> {
    // Kiểm tra xem User này đã đánh giá bài Blog này chưa (tránh spam)
    boolean existsByBlogIdAndUserId(Long blogId, Long userId);
}
