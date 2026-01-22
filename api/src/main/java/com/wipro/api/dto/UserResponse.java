package com.wipro.api.dto;

public record UserResponse(
        Long id,
        String name,
        String email,
        Integer age
) {
}
