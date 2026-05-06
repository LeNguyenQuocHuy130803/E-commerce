package com.example.backend_Ecom.controller;

import com.example.backend_Ecom.dto.*;
import com.example.backend_Ecom.security.UserPrincipal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import lombok.RequiredArgsConstructor;
import com.example.backend_Ecom.service.UserService;

/**
 * REST Controller for user authentication endpoints
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    /**
     * User login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request) throws Exception {
        LoginResponseDto result = this.userService.login(request);
        return ResponseEntity.ok(result);
    }

    /**
     * User registration endpoint
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> register(@Valid @RequestBody RegisterRequestDto request) throws Exception {
        RegisterResponseDto result = this.userService.register(request);
        return ResponseEntity.ok(result);
    }

    /**
     * Refresh access token endpoint
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponseDto> refreshToken(@Valid @RequestBody RefreshTokenRequestDto request) throws Exception {
        RefreshTokenResponseDto result = this.userService.refreshToken(request);
        return ResponseEntity.ok(result);
    }

    /**
     * Verify user email with OTP endpoint
     */
    @PostMapping("/verify-email")
    public ResponseEntity<UserResponseDto> verifyEmail(@Valid @RequestBody VerifyEmailRequestDto request) {
        UserResponseDto result = this.userService.verifyEmail(request);
        return ResponseEntity.ok(result);
    }

    /**
     * Request password reset via email with OTP
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponseDto> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDto request) {
        this.userService.forgotPassword(request);
        return ResponseEntity.ok(MessageResponseDto.builder()
                .success(true)
                .message("Password reset OTP has been sent to your email")
                .build());
    }

    /**
     * Reset password with OTP verification
     */
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponseDto> resetPassword(@Valid @RequestBody ResetPasswordRequestDto request) {
        this.userService.resetPassword(request);
        return ResponseEntity.ok(MessageResponseDto.builder()
                .success(true)
                .message("Password has been reset successfully")
                .build());
    }

    @PatchMapping("/change-password")
    public ResponseEntity<ChangePassResponseDto> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePassRequestDto request
    )
    {
//        if (principal == null) {
//            throw new com.example.backend_Ecom.exception.AppException(
//                    com.example.backend_Ecom.exception.ErrorCode.UNAUTHORIZED,
//                    "Authentication required"
//            );
//        }

        ChangePassResponseDto response = userService.changePassword(principal.getId(), request);
        return ResponseEntity.ok(response);
    }
}
