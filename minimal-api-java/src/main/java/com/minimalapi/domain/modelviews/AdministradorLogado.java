package com.minimalapi.domain.modelviews;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AdministradorLogado(
        @JsonProperty("Email") String email,
        @JsonProperty("Perfil") String perfil,
        @JsonProperty("Token") String token
) {
}
