package de.windalert.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SpotDTO(
        @NotNull Long id,
        @NotBlank String name,
        @NotNull Float latitude,
        @NotNull Float longitude
) {
}
