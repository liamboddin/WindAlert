package de.windalert.dto;

import jakarta.validation.constraints.NotNull;

public record WindWindowDTO(
        Long id,
        @NotNull Integer speed,
        @NotNull Integer startAngle,
        @NotNull Integer endAngle,
        @NotNull Long spotId
) {
}
