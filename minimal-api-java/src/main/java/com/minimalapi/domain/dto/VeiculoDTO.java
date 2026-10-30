package com.minimalapi.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VeiculoDTO(
        @NotBlank(message = "O nome não pode ser vazio")
        String nome,

        @NotBlank(message = "A marca não pode ficar em branco")
        String marca,

        @NotNull(message = "O ano não pode ser vazio")
        @Min(value = 1950, message = "Veiculo muito antigo, aceito apenas anos superiores a 1950")
        Integer ano
) {
}