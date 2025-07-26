package de.windalert.dto;

import jakarta.validation.constraints.NotEmpty;

public record ActivateRequestDTO(
        @NotEmpty String token,
        @NotEmpty String password) {
}
