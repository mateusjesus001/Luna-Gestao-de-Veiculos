package com.minimalapi.domain.modelviews;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Home(
        @JsonProperty("Mensagem") String mensagem,
        @JsonProperty("Doc") String doc
) {
    public Home() {
        this("Bem vindo a API de veiculos - Minimal Api", "/swagger");
    }
}
