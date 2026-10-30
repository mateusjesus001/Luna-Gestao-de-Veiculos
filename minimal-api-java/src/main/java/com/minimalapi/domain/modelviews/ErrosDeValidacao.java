package com.minimalapi.domain.modelviews;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

public class ErrosDeValidacao {

    @JsonProperty("Mensagens")
    private List<String> mensagens = new ArrayList<>();

    public ErrosDeValidacao() {
    }

    public ErrosDeValidacao(List<String> mensagens) {
        this.mensagens = mensagens;
    }

    public List<String> getMensagens() {
        return mensagens;
    }

    public void setMensagens(List<String> mensagens) {
        this.mensagens = mensagens;
    }
}