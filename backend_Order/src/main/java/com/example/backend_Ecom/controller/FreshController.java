package com.example.backend_Ecom.controller;

import com.example.backend_Ecom.dto.FreshRequestDto;
import com.example.backend_Ecom.dto.FreshResponseDto;
import com.example.backend_Ecom.dto.PaginatedFreshResponseDto;
import com.example.backend_Ecom.enums.FreshCategory;
import com.example.backend_Ecom.enums.Region;
import com.example.backend_Ecom.enums.Unit;
import com.example.backend_Ecom.service.BaseProductService;
import com.example.backend_Ecom.service.FreshService;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/freshs")
public class FreshController extends BaseProductController<FreshRequestDto, FreshResponseDto, PaginatedFreshResponseDto> {

    private final FreshService freshService;

    @Override
    protected BaseProductService<?, FreshRequestDto, FreshResponseDto, PaginatedFreshResponseDto> getService() {
        return freshService;
    }

    @GetMapping("/filter")
    public ResponseEntity<PaginatedFreshResponseDto> filterFreshProducts(
            @RequestParam(required = false) List<FreshCategory> categories,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Unit unit,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            @RequestParam(required = false) Region region,
            @Parameter(description = "Page number (1-based)", example = "1") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "Number of items per page", example = "10") @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(freshService.filter(categories, featured, unit, minPrice, maxPrice, region, page, size));
    }
}