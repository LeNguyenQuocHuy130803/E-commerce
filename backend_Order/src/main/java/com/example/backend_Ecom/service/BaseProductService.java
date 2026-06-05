package com.example.backend_Ecom.service;

import com.example.backend_Ecom.dto.MessageResponseDto;
import com.example.backend_Ecom.enums.Region;
import com.example.backend_Ecom.enums.Unit;
import com.example.backend_Ecom.exception.AppException;
import com.example.backend_Ecom.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Generic Base Service chứa toàn bộ logic CRUD dùng chung cho 4 loại sản phẩm.
 *
 * @param <ENTITY>    Entity JPA (Food, Drink, Dessert, Fresh)
 * @param <REQUEST>   DTO nhận từ client (FoodRequestDto, DrinkRequestDto, ...)
 * @param <RESPONSE>  DTO trả về client (FoodResponseDto, DrinkResponseDto, ...)
 * @param <PAGINATED> DTO phân trang (PaginatedFoodResponseDto, ...)
 */
@Slf4j
public abstract class BaseProductService<ENTITY, REQUEST, RESPONSE, PAGINATED> {

    @Autowired
    private FileUploadService fileUploadService;

    // ─────────────────────────────────────────────────────────────────────────────
    // Các hàm ABSTRACT: Bắt buộc lớp con phải tự triển khai (implement)
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Trả về Repository tương ứng của lớp con
     */
    protected abstract JpaRepository<ENTITY, Long> getRepository();

    /**
     * Trả về Repository tương ứng (có hỗ trợ Specification cho Filter)
     */
    protected abstract JpaSpecificationExecutor<ENTITY> getSpecificationExecutor();

    /**
     * Chuyển đổi Entity -> ResponseDto
     */
    protected abstract RESPONSE mapToDto(ENTITY entity);

    /**
     * Tạo Entity mới từ Request (dùng cho create)
     */
    protected abstract ENTITY buildNewEntity(REQUEST request, String imageUrl);

    /**
     * Cập nhật các field của Entity từ Request (dùng cho update)
     */
    protected abstract void updateEntityFields(ENTITY entity, REQUEST request);

    /**
     * Lấy imageUrl từ Entity hiện tại
     */
    protected abstract String getImageUrl(ENTITY entity);

    /**
     * Set imageUrl vào Entity
     */
    protected abstract void setImageUrl(ENTITY entity, String imageUrl);

    /**
     * Lấy imageUrl từ Request
     */
    protected abstract String getImageUrlFromRequest(REQUEST request);

    /**
     * Lấy MultipartFile ảnh từ Request
     */
    protected abstract MultipartFile getImageFileFromRequest(REQUEST request);

    /**
     * Lấy tên sản phẩm từ Request (để check trùng)
     */
    protected abstract String getNameFromRequest(REQUEST request);

    /**
     * Lấy tên sản phẩm từ Entity (để check trùng khi update)
     */
    protected abstract String getNameFromEntity(ENTITY entity);

    /**
     * Kiểm tra tên đã tồn tại trong DB chưa
     */
    protected abstract boolean existsByName(String name);

    /**
     * Tên loại sản phẩm để ghi vào log ("Food", "Drink", ...)
     */
    protected abstract String getProductTypeName();

    /**
     * Build Specification cho Filter
     */
    protected abstract Specification<ENTITY> buildFilterSpecification(
            List<?> categories, Boolean featured, Unit unit,
            Long minPrice, Long maxPrice, Region region);

    /**
     * Build đối tượng PAGINATED response
     */
    protected abstract PAGINATED buildPaginatedResponse(Page<ENTITY> page, List<RESPONSE> dtos);

    // ─────────────────────────────────────────────────────────────────────────────
    // Các hàm SHARED: Logic dùng chung — chỉ viết 1 lần!
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Tạo sản phẩm mới
     */
    public RESPONSE create(REQUEST request) {
        // LOGIC NGHIỆP VỤ: Kiểm tra trùng tên trong Database
        if (existsByName(getNameFromRequest(request))) {
            throw new AppException(ErrorCode.INVALID_REQUEST, getProductTypeName() + " name already exists");
        }

        String uploadedImageUrl = null;
        try {
            MultipartFile imageFile = getImageFileFromRequest(request);
            if (imageFile != null && !imageFile.isEmpty()) {
                uploadedImageUrl = fileUploadService.uploadImage(imageFile);
            } else if (getImageUrlFromRequest(request) != null) {
                uploadedImageUrl = getImageUrlFromRequest(request);
            }

            ENTITY entity = buildNewEntity(request, uploadedImageUrl);
            entity = getRepository().save(entity);
            log.info("✓ {} created successfully", getProductTypeName());
            return mapToDto(entity);

        } catch (Exception e) {
            // COMPENSATING TRANSACTION: Xóa ảnh mồ côi nếu DB lưu lỗi
            MultipartFile imageFile = getImageFileFromRequest(request);
            if (uploadedImageUrl != null && imageFile != null && !imageFile.isEmpty()) {
                try {
                    fileUploadService.deleteImage(uploadedImageUrl);
                } catch (Exception ex) {
                    log.error("Failed to delete orphaned image: {}", uploadedImageUrl);
                }
            }
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR,
                    "Failed to create " + getProductTypeName() + ": " + e.getMessage());
        }
    }

    /**
     * Cập nhật sản phẩm theo ID
     */
    public RESPONSE update(Long id, REQUEST request) {
        ENTITY entity = getRepository().findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST,
                        getProductTypeName() + " not found"));

        // LOGIC NGHIỆP VỤ: Kiểm tra trùng tên khi đổi tên
        String newName = getNameFromRequest(request);
        if (newName != null
                && !getNameFromEntity(entity).equals(newName)
                && existsByName(newName)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, getProductTypeName() + " name already exists");
        }

        String oldImageUrl = getImageUrl(entity);
        String newlyUploadedUrl = null;

        try {
            // Xử lý ảnh mới
            MultipartFile imageFile = getImageFileFromRequest(request);
            if (imageFile != null && !imageFile.isEmpty()) {
                newlyUploadedUrl = fileUploadService.uploadImage(imageFile);
                setImageUrl(entity, newlyUploadedUrl);
            } else if (getImageUrlFromRequest(request) != null) {
                setImageUrl(entity, getImageUrlFromRequest(request));
            }

            // Cập nhật các field
            updateEntityFields(entity, request);
            entity = getRepository().save(entity);

            // CHỈ XÓA ẢNH CŨ KHI SAVE THÀNH CÔNG
            if (newlyUploadedUrl != null && oldImageUrl != null && !oldImageUrl.isEmpty()) {
                try {
                    fileUploadService.deleteImage(oldImageUrl);
                } catch (Exception ex) {
                    log.error("Failed to delete old image: {}", oldImageUrl);
                }
            }

            log.info("✓ {} updated: {}", getProductTypeName(), id);
            return mapToDto(entity);

        } catch (Exception e) {
            // COMPENSATING TRANSACTION: Xóa ảnh mới nếu update DB thất bại
            if (newlyUploadedUrl != null) {
                try {
                    fileUploadService.deleteImage(newlyUploadedUrl);
                } catch (Exception ex) {
                    log.error("Failed to delete orphaned new image: {}", newlyUploadedUrl);
                }
            }
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR,
                    "Failed to update " + getProductTypeName() + ": " + e.getMessage());
        }
    }

    /**
     * Xóa sản phẩm theo ID
     */
    public void delete(Long id) {
        ENTITY entity = getRepository().findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST,
                        getProductTypeName() + " not found"));

        getRepository().delete(entity);

        // Xóa ảnh Cloudinary sau khi DB đã commit thành công
        String imageUrl = getImageUrl(entity);
        if (imageUrl != null) {
            try {
                fileUploadService.deleteImage(imageUrl);
            } catch (Exception e) {
                log.warn("⚠️ {} {} deletion failed: Cloudinary image deletion error: {}",
                        getProductTypeName(), id, e.getMessage());
            }
        }

        log.info("✓ {} deleted successfully: {}", getProductTypeName(), id);
    }

    /**
     * Lấy sản phẩm theo ID
     */
    public RESPONSE getById(Long id) {
        ENTITY entity = getRepository().findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST,
                        getProductTypeName() + " not found"));
        return mapToDto(entity);
    }

    /**
     * Lấy danh sách sản phẩm có phân trang
     */
    public PAGINATED getAllPaginated(int page, int size) {
        if (page < 1) page = 1;
        if (size < 1) size = 10;
        Pageable pageable = PageRequest.of(page - 1, size);

        Page<ENTITY> entityPage = getRepository().findAll(pageable);

        List<RESPONSE> dtos = entityPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return buildPaginatedResponse(entityPage, dtos);
    }

    /**
     * Lọc sản phẩm theo tiêu chí với phân trang
     */
    public PAGINATED filter(List<?> categories, Boolean featured, Unit unit,
                             Long minPrice, Long maxPrice, Region region,
                             int page, int size) {
        // LOGIC VALIDATE: Kiểm tra range giá hợp lệ
        if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "minPrice (" + minPrice + ") cannot be greater than maxPrice (" + maxPrice + ")");
        }

        log.info("Filtering {} - categories: {}, featured: {}, unit: {}, price: {} - {}, region: {}, page: {}, size: {}",
                getProductTypeName(), categories, featured, unit, minPrice, maxPrice, region, page, size);

        if (page < 1) page = 1;
        if (size < 1) size = 10;
        Pageable pageable = PageRequest.of(page - 1, size);

        Specification<ENTITY> spec = buildFilterSpecification(categories, featured, unit, minPrice, maxPrice, region);
        Page<ENTITY> entityPage = getSpecificationExecutor().findAll(spec, pageable);

        List<RESPONSE> dtos = entityPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return buildPaginatedResponse(entityPage, dtos);
    }
}
