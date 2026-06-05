package com.example.backend_Ecom.service;

import com.example.backend_Ecom.dto.FreshRequestDto;
import com.example.backend_Ecom.dto.FreshResponseDto;
import com.example.backend_Ecom.dto.PaginatedFreshResponseDto;
import com.example.backend_Ecom.entity.Fresh;
import com.example.backend_Ecom.enums.FreshCategory;
import com.example.backend_Ecom.enums.Region;
import com.example.backend_Ecom.enums.Unit;
import com.example.backend_Ecom.repository.FreshRepository;
import com.example.backend_Ecom.specification.FreshSpecification;
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
public class FreshService extends BaseProductService<Fresh, FreshRequestDto, FreshResponseDto, PaginatedFreshResponseDto> {

    private final FreshRepository freshRepository;

    @Override
    protected JpaRepository<Fresh, Long> getRepository() { return freshRepository; }

    @Override
    protected JpaSpecificationExecutor<Fresh> getSpecificationExecutor() { return freshRepository; }

    @Override
    protected String getProductTypeName() { return "Fresh"; }

    @Override
    protected boolean existsByName(String name) { return freshRepository.existsByName(name); }

    @Override
    protected String getNameFromRequest(FreshRequestDto request) { return request.getName(); }

    @Override
    protected String getNameFromEntity(Fresh entity) { return entity.getName(); }

    @Override
    protected String getImageUrl(Fresh entity) { return entity.getImageUrl(); }

    @Override
    protected void setImageUrl(Fresh entity, String imageUrl) { entity.setImageUrl(imageUrl); }

    @Override
    protected String getImageUrlFromRequest(FreshRequestDto request) { return request.getImageUrl(); }

    @Override
    protected MultipartFile getImageFileFromRequest(FreshRequestDto request) { return request.getImage(); }

    @Override
    protected Fresh buildNewEntity(FreshRequestDto request, String imageUrl) {
        return Fresh.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .imageUrl(imageUrl)
                .category(request.getCategory() != null ? request.getCategory() : FreshCategory.VEGETABLE)
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .unit(request.getUnit() != null ? request.getUnit() : Unit.ITEM)
                .region(request.getRegion() != null ? request.getRegion() : Region.HA_NOI)
                .build();
    }

    @Override
    protected void updateEntityFields(Fresh entity, FreshRequestDto request) {
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
    protected FreshResponseDto mapToDto(Fresh fresh) {
        return FreshResponseDto.builder()
                .id(fresh.getId())
                .name(fresh.getName())
                .description(fresh.getDescription())
                .price(fresh.getPrice())
                .quantity(fresh.getQuantity())
                .imageUrl(fresh.getImageUrl())
                .category(fresh.getCategory())
                .featured(fresh.getFeatured())
                .unit(fresh.getUnit())
                .region(fresh.getRegion())
                .createdAt(fresh.getCreatedAt())
                .updatedAt(fresh.getUpdatedAt())
                .build();
    }

    @Override
    protected Specification<Fresh> buildFilterSpecification(List<?> categories, Boolean featured,
                                                             Unit unit, Long minPrice, Long maxPrice, Region region) {
        @SuppressWarnings("unchecked")
        List<FreshCategory> freshCategories = (List<FreshCategory>) categories;
        return FreshSpecification.filterByCriteria(freshCategories, featured, unit, minPrice, maxPrice, region);
    }

    @Override
    protected PaginatedFreshResponseDto buildPaginatedResponse(Page<Fresh> page, List<FreshResponseDto> dtos) {
        return PaginatedFreshResponseDto.builder()
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