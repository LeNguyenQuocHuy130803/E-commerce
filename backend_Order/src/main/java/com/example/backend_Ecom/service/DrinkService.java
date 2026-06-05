package com.example.backend_Ecom.service;

import com.example.backend_Ecom.dto.DrinkRequestDto;
import com.example.backend_Ecom.dto.DrinkResponseDto;
import com.example.backend_Ecom.dto.PaginatedDrinkResponseDto;
import com.example.backend_Ecom.entity.Drink;
import com.example.backend_Ecom.enums.DrinkCategory;
import com.example.backend_Ecom.enums.Region;
import com.example.backend_Ecom.enums.Unit;
import com.example.backend_Ecom.repository.DrinkRepository;
import com.example.backend_Ecom.specification.DrinkSpecification;
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
public class DrinkService extends BaseProductService<Drink, DrinkRequestDto, DrinkResponseDto, PaginatedDrinkResponseDto> {

    private final DrinkRepository drinkRepository;

    @Override
    protected JpaRepository<Drink, Long> getRepository() { return drinkRepository; }

    @Override
    protected JpaSpecificationExecutor<Drink> getSpecificationExecutor() { return drinkRepository; }

    @Override
    protected String getProductTypeName() { return "Drink"; }

    @Override
    protected boolean existsByName(String name) { return drinkRepository.existsByName(name); }

    @Override
    protected String getNameFromRequest(DrinkRequestDto request) { return request.getName(); }

    @Override
    protected String getNameFromEntity(Drink entity) { return entity.getName(); }

    @Override
    protected String getImageUrl(Drink entity) { return entity.getImageUrl(); }

    @Override
    protected void setImageUrl(Drink entity, String imageUrl) { entity.setImageUrl(imageUrl); }

    @Override
    protected String getImageUrlFromRequest(DrinkRequestDto request) { return request.getImageUrl(); }

    @Override
    protected MultipartFile getImageFileFromRequest(DrinkRequestDto request) { return request.getImage(); }

    @Override
    protected Drink buildNewEntity(DrinkRequestDto request, String imageUrl) {
        return Drink.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .imageUrl(imageUrl)
                .category(request.getCategory() != null ? request.getCategory() : DrinkCategory.COFFEE)
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .unit(request.getUnit() != null ? request.getUnit() : Unit.ITEM)
                .region(request.getRegion() != null ? request.getRegion() : Region.HA_NOI)
                .build();
    }

    @Override
    protected void updateEntityFields(Drink entity, DrinkRequestDto request) {
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
    protected DrinkResponseDto mapToDto(Drink drink) {
        return DrinkResponseDto.builder()
                .id(drink.getId())
                .name(drink.getName())
                .description(drink.getDescription())
                .price(drink.getPrice())
                .quantity(drink.getQuantity())
                .imageUrl(drink.getImageUrl())
                .category(drink.getCategory())
                .featured(drink.getFeatured())
                .unit(drink.getUnit())
                .region(drink.getRegion())
                .createdAt(drink.getCreatedAt())
                .updatedAt(drink.getUpdatedAt())
                .build();
    }

    @Override
    protected Specification<Drink> buildFilterSpecification(List<?> categories, Boolean featured,
                                                             Unit unit, Long minPrice, Long maxPrice, Region region) {
        @SuppressWarnings("unchecked")
        List<DrinkCategory> drinkCategories = (List<DrinkCategory>) categories;
        return DrinkSpecification.filterByCriteria(drinkCategories, featured, unit, minPrice, maxPrice, region);
    }

    @Override
    protected PaginatedDrinkResponseDto buildPaginatedResponse(Page<Drink> page, List<DrinkResponseDto> dtos) {
        return PaginatedDrinkResponseDto.builder()
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