package com.example.backend_Ecom.controller;

import com.example.backend_Ecom.dto.MessageResponseDto;
import com.example.backend_Ecom.service.BaseProductService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Generic Base Controller chứa toàn bộ các API endpoint CRUD dùng chung.
 *
 * @param <REQUEST>   DTO nhận từ client
 * @param <RESPONSE>  DTO trả về client
 * @param <PAGINATED> DTO phân trang
 */
public abstract class BaseProductController<REQUEST, RESPONSE, PAGINATED> {


    protected abstract BaseProductService<?, REQUEST, RESPONSE, PAGINATED> getService();  // sau khi con kế thưa nó sẽ được đưa vào đây

    /**
     * GET /paging - Lấy danh sách có phân trang
     */
    @GetMapping("/paging")
    public ResponseEntity<PAGINATED> getAllPaginated(
            @Parameter(description = "Page number (1-based)", example = "1")
            @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(getService().getAllPaginated(page, size));
    }

    /**
     * GET /{id} - Lấy chi tiết theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<RESPONSE> getById(@PathVariable Long id) {
        return ResponseEntity.ok(getService().getById(id));
    }

    /**
     * POST / - Tạo mới (upload ảnh qua multipart/form-data)
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RESPONSE> create(@Valid @ModelAttribute REQUEST request) {
        return ResponseEntity.ok(getService().create(request));
    }

    /**
     * PATCH /{id} - Cập nhật một phần
     */
    @PatchMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RESPONSE> update(
            @PathVariable Long id,
            @Valid @ModelAttribute REQUEST request) {
        return ResponseEntity.ok(getService().update(id, request));
    }

    /**
     * DELETE /{id} - Xóa theo ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponseDto> delete(@PathVariable Long id) {
        getService().delete(id);
        return ResponseEntity.ok(MessageResponseDto.builder()
                .success(true)
                .message("Deleted successfully")
                .build());
    }
}
