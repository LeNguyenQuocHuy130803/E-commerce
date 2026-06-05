package com.example.backend_Ecom.service;

import com.example.backend_Ecom.dto.FoodRequestDto;
import com.example.backend_Ecom.dto.FoodResponseDto;
import com.example.backend_Ecom.dto.PaginatedFoodResponseDto;
import com.example.backend_Ecom.entity.Food;
import com.example.backend_Ecom.enums.FoodCategory;
import com.example.backend_Ecom.enums.Region;
import com.example.backend_Ecom.enums.Unit;
import com.example.backend_Ecom.repository.FoodRepository;
import com.example.backend_Ecom.specification.FoodSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@Service
public class FoodService extends BaseProductService<Food, FoodRequestDto, FoodResponseDto, PaginatedFoodResponseDto> {

    private final FoodRepository foodRepository;

    @Override
    protected JpaRepository<Food, Long> getRepository() { return foodRepository; }

    @Override
    protected JpaSpecificationExecutor<Food> getSpecificationExecutor() { return foodRepository; }

    @Override
    protected String getProductTypeName() { return "Food"; }

    @Override
    protected boolean existsByName(String name) { return foodRepository.existsByName(name); }

    @Override
    protected String getNameFromRequest(FoodRequestDto request) { return request.getName(); }

    @Override
    protected String getNameFromEntity(Food entity) { return entity.getName(); }

    @Override
    protected String getImageUrl(Food entity) { return entity.getImageUrl(); }

    @Override
    protected void setImageUrl(Food entity, String imageUrl) { entity.setImageUrl(imageUrl); }

    @Override
    protected String getImageUrlFromRequest(FoodRequestDto request) { return request.getImageUrl(); }

    @Override
    protected MultipartFile getImageFileFromRequest(FoodRequestDto request) { return request.getImage(); }

    @Override
    protected Food buildNewEntity(FoodRequestDto request, String imageUrl) {
        return Food.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .imageUrl(imageUrl)
                .category(request.getCategory() != null ? request.getCategory() : FoodCategory.RICE)
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .unit(request.getUnit() != null ? request.getUnit() : Unit.ITEM)
                .region(request.getRegion() != null ? request.getRegion() : Region.HA_NOI)
                .build();
    }

    @Override
    protected void updateEntityFields(Food entity, FoodRequestDto request) {
        if (request.getName() != null) entity.setName(request.getName());
        if (request.getDescription() != null) entity.setDescription(request.getDescription());
        if (request.getPrice() != null) entity.setPrice(request.getPrice());
        if (request.getQuantity() != null) entity.setQuantity(request.getQuantity());
        if (request.getCategory() != null) entity.setCategory(request.getCategory());
        if (request.getFeatured() != null) entity.setFeatured(request.getFeatured());
        if (request.getUnit() != null) entity.setUnit(request.getUnit());
        if (request.getRegion() != null) entity.setRegion(request.getRegion());
    }

    @Override
    protected FoodResponseDto mapToDto(Food food) {
        return FoodResponseDto.builder()
                .id(food.getId())
                .name(food.getName())
                .description(food.getDescription())
                .price(food.getPrice())
                .quantity(food.getQuantity())
                .imageUrl(food.getImageUrl())
                .category(food.getCategory())
                .featured(food.getFeatured())
                .unit(food.getUnit())
                .region(food.getRegion())
                .createdAt(food.getCreatedAt())
                .updatedAt(food.getUpdatedAt())
                .build();
    }

    @Override
    protected Specification<Food> buildFilterSpecification(List<?> categories, Boolean featured,
                                                            Unit unit, Long minPrice, Long maxPrice, Region region) {
        @SuppressWarnings("unchecked")
        List<FoodCategory> foodCategories = (List<FoodCategory>) categories;
        return FoodSpecification.filterByCriteria(foodCategories, featured, unit, minPrice, maxPrice, region);
    }

    @Override
    protected PaginatedFoodResponseDto buildPaginatedResponse(Page<Food> page, List<FoodResponseDto> dtos) {
        return PaginatedFoodResponseDto.builder()
                .data(dtos)
                .pageNumber(page.getNumber() + 1)
                .pageSize(page.getSize())
                .totalRecords(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
}