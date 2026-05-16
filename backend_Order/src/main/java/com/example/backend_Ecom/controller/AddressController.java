package com.example.backend_Ecom.controller;

import com.example.backend_Ecom.dto.AddressRequestDto;
import com.example.backend_Ecom.dto.AddressResponseDto;
import com.example.backend_Ecom.dto.MessageResponseDto;
import com.example.backend_Ecom.security.UserPrincipal;
import com.example.backend_Ecom.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users/addresses")
public class AddressController {

    private final AddressService addressService;

    /**
     * Get all addresses for current user
     * GET /api/users/addresses
     * Required: Authentication token
     */
    @GetMapping
    @Operation(summary = "Get all addresses for current user")
    public ResponseEntity<List<AddressResponseDto>> getAddressesByUserId(
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal.getId();
        return ResponseEntity.ok(addressService.getAddressesByUserId(userId));
    }

    /**
     * Get address by ID
     * GET /api/users/addresses/{addressId}
     * Required: Authentication token
     */
    @GetMapping("/{addressId}")
    @Operation(summary = "Get address by ID")
    public ResponseEntity<AddressResponseDto> getAddressById(
            @AuthenticationPrincipal UserPrincipal principal,
            @Parameter(description = "Address ID", example = "1")
            @PathVariable Long addressId) {
        return ResponseEntity.ok(addressService.getAddressById(addressId, principal.getId()));
    }

    /**
     * Create new address
     * POST /api/users/addresses
     * Required: Authentication token
     *
     * Body (JSON):
     * {
     *   "type": "HOME",
     *   "address": "123 Đường A, Quận 1, TP.HCM",
     *   "isDefault": true
     * }
     */
    @PostMapping
    @Operation(summary = "Create new address")
    public ResponseEntity<AddressResponseDto> createAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AddressRequestDto request) {
        Long userId = principal.getId();
        AddressResponseDto response = addressService.createAddress(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Update address
     * PATCH /api/users/addresses/{addressId}
     * Required: Authentication token
     */
    @PatchMapping("/{addressId}")
    @Operation(summary = "Update address")
    public ResponseEntity<AddressResponseDto> updateAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @Parameter(description = "Address ID", example = "1")
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequestDto request) {
        return ResponseEntity.ok(addressService.updateAddress(addressId, request, principal.getId()));
    }

    /**
     * Delete address
     * DELETE /api/users/addresses/{addressId}
     * Required: Authentication token
     */
    @DeleteMapping("/{addressId}")
    @Operation(summary = "Delete address")
    public ResponseEntity<MessageResponseDto> deleteAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @Parameter(description = "Address ID", example = "1")
            @PathVariable Long addressId) {
        addressService.deleteAddress(addressId, principal.getId());
        return ResponseEntity.ok(MessageResponseDto.builder()
                .success(true)
                .message("Address deleted successfully")
                .build());
    }

    /**
     * Get default address (type = HOME) for current user
     * GET /api/address/default
     * Required: Authentication token
     */
    @GetMapping("/default")
    @Operation(summary = "Get default address for current user")
    public ResponseEntity<AddressResponseDto> getDefaultAddress(
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal.getId();
        return ResponseEntity.ok(addressService.getDefaultAddress(userId));
    }
}
