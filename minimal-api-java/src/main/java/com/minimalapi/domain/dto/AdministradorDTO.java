package com.minimalapi.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdministradorDTO(
        @NotBlank(message = "Email não pode ser vazio")
        String email,

        @NotBlank(message = "Senha não pode ser vazia")
        String senha,

        @NotNull(message = "Perfil não pode ser vazio")
        String perfil
) {
}