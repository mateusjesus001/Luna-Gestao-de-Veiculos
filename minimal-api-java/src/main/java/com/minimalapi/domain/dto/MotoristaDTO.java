package com.minimalapi.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record MotoristaDTO(
        @NotBlank(message = "O nome não pode ser vazio")
        String nome,

        @NotBlank(message = "A função não pode ficar em branco")
        String funcao,

        @NotBlank(message = "O telefone não pode ficar em branco")
        String telefone,

        @Email(message = "Email inválido")
        String email,

        @NotNull(message = "A quantidade de viagens não pode ser vazia")
        @Positive(message = "A quantidade de viagens deve ser maior que zero")
        Integer qtdViagem,

        @NotNull(message = "A pontuação não pode ser vazia")
        @Positive(message = "A pontuação deve ser maior que zero")
        BigDecimal pontuacao,

        @NotBlank(message = "O status não pode ficar em branco")
        String status,

        String veiculo
) {
}
