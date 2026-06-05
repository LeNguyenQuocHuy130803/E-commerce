package com.example.backend_Ecom.controller;

import com.example.backend_Ecom.dto.DrinkRequestDto;
import com.example.backend_Ecom.dto.DrinkResponseDto;
import com.example.backend_Ecom.dto.PaginatedDrinkResponseDto;
import com.example.backend_Ecom.enums.DrinkCategory;
import com.example.backend_Ecom.enums.Region;
import com.example.backend_Ecom.enums.Unit;
import com.example.backend_Ecom.service.BaseProductService;
import com.example.backend_Ecom.service.DrinkService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/drinks")
public class DrinkController extends BaseProductController<DrinkRequestDto, DrinkResponseDto, PaginatedDrinkResponseDto> {

    private final DrinkService drinkService;

    @Override
    protected BaseProductService<?, DrinkRequestDto, DrinkResponseDto, PaginatedDrinkResponseDto> getService() {
        return drinkService;
    }

    @GetMapping("/filter")
    public ResponseEntity<PaginatedDrinkResponseDto> filterDrinks(
            @RequestParam(required = false) List<DrinkCategory> categories,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Unit unit,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(required = false) Region region,
            @Parameter(description = "Page number (1-based)", example = "1") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "Number of items per page", example = "10") @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(drinkService.filter(categories, featured, unit, minPrice, maxPrice, region, page, size));
    }
}