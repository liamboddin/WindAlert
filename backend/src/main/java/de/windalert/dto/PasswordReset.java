package de.windalert.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PasswordReset(
        @NotNull UUID uuid,
        @NotBlank String password
) {
}
