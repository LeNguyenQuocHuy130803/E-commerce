package com.example.backend_Ecom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChangePassResponseDto {
    private String message;
    private boolean success;
}