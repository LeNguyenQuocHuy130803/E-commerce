package com.example.backend_Ecom.controller;

import com.example.backend_Ecom.dto.DessertRequestDto;
import com.example.backend_Ecom.dto.DessertResponseDto;
import com.example.backend_Ecom.dto.PaginatedDessertResponseDto;
import com.example.backend_Ecom.enums.DessertCategory;
import com.example.backend_Ecom.enums.Region;
import com.example.backend_Ecom.enums.Unit;
import com.example.backend_Ecom.service.BaseProductService;
import com.example.backend_Ecom.service.DessertService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/desserts")
public class DessertController extends BaseProductController<DessertRequestDto, DessertResponseDto, PaginatedDessertResponseDto> {

    private final DessertService dessertService;

    @Override
    protected BaseProductService<?, DessertRequestDto, DessertResponseDto, PaginatedDessertResponseDto> getService() {
        return dessertService;
    }

    @GetMapping("/filter")
    public ResponseEntity<PaginatedDessertResponseDto> filterDesserts(
            @RequestParam(required = false) List<DessertCategory> categories,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Unit unit,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(required = false) Region region,
            @Parameter(description = "Page number (1-based)", example = "1") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "Number of items per page", example = "10") @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(dessertService.filter(categories, featured, unit, minPrice, maxPrice, region, page, size));
    }
}