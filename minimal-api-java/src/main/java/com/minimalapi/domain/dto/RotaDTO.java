package com.minimalapi.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RotaDTO(
        @NotBlank(message = "A origem não pode ser vazia")
        String origem,

        @NotBlank(message = "O destino não pode ser vazio")
        String destino,

        @NotBlank(message = "O veículo não pode ser vazio")
        String veiculo,

        @NotBlank(message = "O motorista não pode ser vazio")
        String motorista,

        @NotBlank(message = "O horário não pode ser vazio")
        String horario,

        @NotBlank(message = "A distância não pode ser vazia")
        String distancia,

        @NotBlank(message = "O status não pode ser vazio")
        String status
) {
}
