package de.windalert.dto;

import jakarta.validation.constraints.NotEmpty;

public record RegisterRequestDTO(
        @NotEmpty String username,
        @NotEmpty String baseUrl
) {
}
