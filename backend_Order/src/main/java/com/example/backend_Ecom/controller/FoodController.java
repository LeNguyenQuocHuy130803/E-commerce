package com.example.backend_Ecom.controller;

import com.example.backend_Ecom.dto.FoodRequestDto;
import com.example.backend_Ecom.dto.FoodResponseDto;
import com.example.backend_Ecom.dto.PaginatedFoodResponseDto;
import com.example.backend_Ecom.enums.FoodCategory;
import com.example.backend_Ecom.enums.Region;
import com.example.backend_Ecom.enums.Unit;
import com.example.backend_Ecom.service.BaseProductService;
import com.example.backend_Ecom.service.FoodService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/foods")
public class FoodController extends BaseProductController<FoodRequestDto, FoodResponseDto, PaginatedFoodResponseDto> {

    private final FoodService foodService;

    @Override
    protected BaseProductService<?, FoodRequestDto, FoodResponseDto, PaginatedFoodResponseDto> getService() {
        return foodService;
    }

    @GetMapping("/filter")
    public ResponseEntity<PaginatedFoodResponseDto> filterFoods(
            @RequestParam(required = false) List<FoodCategory> categories,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Unit unit,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(required = false) Region region,
            @Parameter(description = "Page number (1-based)", example = "1") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "Number of items per page", example = "10") @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(foodService.filter(categories, featured, unit, minPrice, maxPrice, region, page, size));
    }
}