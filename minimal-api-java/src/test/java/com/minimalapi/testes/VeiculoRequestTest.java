package com.minimalapi.testes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.minimalapi.MinimalApiApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = MinimalApiApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(Setup.class)
public class VeiculoRequestTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String obterTokenAdm() throws Exception {
        String loginBody = """
                {
                  "email": "adm@teste.com",
                  "senha": "123456"
                }
                """;

        String response = mockMvc.perform(post("/administradores/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode json = objectMapper.readTree(response);
        return json.get("Token").asText();
    }

    @Test
    void testarListarVeiculos() throws Exception {
        String token = obterTokenAdm();

        mockMvc.perform(get("/veiculos")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void testarIncluirVeiculo() throws Exception {
        String token = obterTokenAdm();

        String veiculoBody = """
                {
                  "nome": "Civic",
                  "marca": "Honda",
                  "ano": 2020
                }
                """;

        mockMvc.perform(post("/veiculos")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(veiculoBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.Nome").value("Civic"))
                .andExpect(jsonPath("$.Marca").value("Honda"))
                .andExpect(jsonPath("$.Ano").value(2020));
    }

    @Test
    void testarIncluirVeiculoAntigo() throws Exception {
        String token = obterTokenAdm();

        String veiculoBody = """
                {
                  "nome": "Ford T",
                  "marca": "Ford",
                  "ano": 1920
                }
                """;

        mockMvc.perform(post("/veiculos")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(veiculoBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testarBuscarVeiculoPorId() throws Exception {
        String token = obterTokenAdm();

        mockMvc.perform(get("/veiculos/1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void testarBuscarVeiculoInexistente() throws Exception {
        String token = obterTokenAdm();

        mockMvc.perform(get("/veiculos/999999")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void testarAtualizarVeiculo() throws Exception {
        String token = obterTokenAdm();

        String veiculoBody = """
                {
                  "nome": "Opala SS",
                  "marca": "Chevrolet",
                  "ano": 1975
                }
                """;

        mockMvc.perform(put("/veiculos/1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(veiculoBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.Nome").value("Opala SS"))
                .andExpect(jsonPath("$.Marca").value("Chevrolet"))
                .andExpect(jsonPath("$.Ano").value(1975));
    }

    @Test
    void testarDeletarVeiculo() throws Exception {
        String token = obterTokenAdm();

        mockMvc.perform(delete("/veiculos/99999")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void testarListarVeiculosSemToken() throws Exception {
        mockMvc.perform(get("/veiculos"))
                .andExpect(status().isUnauthorized());
    }
}