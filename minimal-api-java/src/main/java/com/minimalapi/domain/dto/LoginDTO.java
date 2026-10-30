package com.minimalapi.domain.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO(
        @NotBlank(message = "Email não pode ser vazio")
        String email,

        @NotBlank(message = "Senha não pode ser vazia")
        String senha
) {
}
