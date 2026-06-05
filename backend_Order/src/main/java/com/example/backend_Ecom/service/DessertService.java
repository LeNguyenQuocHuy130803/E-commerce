package com.example.backend_Ecom.service;

import com.example.backend_Ecom.dto.DessertRequestDto;
import com.example.backend_Ecom.dto.DessertResponseDto;
import com.example.backend_Ecom.dto.PaginatedDessertResponseDto;
import com.example.backend_Ecom.entity.Dessert;
import com.example.backend_Ecom.enums.DessertCategory;
import com.example.backend_Ecom.enums.Region;
import com.example.backend_Ecom.enums.Unit;
import com.example.backend_Ecom.repository.DessertRepository;
import com.example.backend_Ecom.specification.DessertSpecification;
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
public class DessertService extends BaseProductService<Dessert, DessertRequestDto, DessertResponseDto, PaginatedDessertResponseDto> {

    private final DessertRepository dessertRepository;

    @Override
    protected JpaRepository<Dessert, Long> getRepository() { return dessertRepository; }

    @Override
    protected JpaSpecificationExecutor<Dessert> getSpecificationExecutor() { return dessertRepository; }

    @Override
    protected String getProductTypeName() { return "Dessert"; }

    @Override
    protected boolean existsByName(String name) { return dessertRepository.existsByName(name); }

    @Override
    protected String getNameFromRequest(DessertRequestDto request) { return request.getName(); }

    @Override
    protected String getNameFromEntity(Dessert entity) { return entity.getName(); }

    @Override
    protected String getImageUrl(Dessert entity) { return entity.getImageUrl(); }

    @Override
    protected void setImageUrl(Dessert entity, String imageUrl) { entity.setImageUrl(imageUrl); }

    @Override
    protected String getImageUrlFromRequest(DessertRequestDto request) { return request.getImageUrl(); }

    @Override
    protected MultipartFile getImageFileFromRequest(DessertRequestDto request) { return request.getImage(); }

    @Override
    protected Dessert buildNewEntity(DessertRequestDto request, String imageUrl) {
        return Dessert.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .imageUrl(imageUrl)
                .category(request.getCategory() != null ? request.getCategory() : DessertCategory.CAKE)
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .unit(request.getUnit() != null ? request.getUnit() : Unit.ITEM)
                .region(request.getRegion() != null ? request.getRegion() : Region.HA_NOI)
                .build();
    }

    @Override
    protected void updateEntityFields(Dessert entity, DessertRequestDto request) {
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
    protected DessertResponseDto mapToDto(Dessert dessert) {
        return DessertResponseDto.builder()
                .id(dessert.getId())
                .name(dessert.getName())
                .description(dessert.getDescription())
                .price(dessert.getPrice())
                .quantity(dessert.getQuantity())
                .imageUrl(dessert.getImageUrl())
                .category(dessert.getCategory())
                .featured(dessert.getFeatured())
                .unit(dessert.getUnit())
                .region(dessert.getRegion())
                .createdAt(dessert.getCreatedAt())
                .updatedAt(dessert.getUpdatedAt())
                .build();
    }

    @Override
    protected Specification<Dessert> buildFilterSpecification(List<?> categories, Boolean featured,
                                                               Unit unit, Long minPrice, Long maxPrice, Region region) {
        @SuppressWarnings("unchecked")
        List<DessertCategory> dessertCategories = (List<DessertCategory>) categories;
        return DessertSpecification.filterByCriteria(dessertCategories, featured, unit, minPrice, maxPrice, region);
    }

    @Override
    protected PaginatedDessertResponseDto buildPaginatedResponse(Page<Dessert> page, List<DessertResponseDto> dtos) {
        return PaginatedDessertResponseDto.builder()
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