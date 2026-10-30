package com.minimalapi.domain.modelviews;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AdministradorModelView(
        @JsonProperty("Id") Integer id,
        @JsonProperty("Email") String email,
        @JsonProperty("Perfil") String perfil
) {
}
