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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = MinimalApiApplication.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(Setup.class)
public class AdministradorRequestTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testarLogin() throws Exception {
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
        assertNotNull(json.get("Email"));
        assertNotNull(json.get("Perfil"));
        assertNotNull(json.get("Token"));
        assertEquals("adm@teste.com", json.get("Email").asText());
        assertEquals("Adm", json.get("Perfil").asText());
        assertTrue(json.get("Token").asText().length() > 0);
    }

    @Test
    void testarLoginFalha() throws Exception {
        String loginBody = """
                {
                  "email": "naoexiste@teste.com",
                  "senha": "123456"
                }
                """;

        mockMvc.perform(post("/administradores/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testarBuscarAdministradorPorId() throws Exception {
        String loginBody = """
                {
                  "email": "adm@teste.com",
                  "senha": "123456"
                }
                """;

        String loginResponse = mockMvc.perform(post("/administradores/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode json = objectMapper.readTree(loginResponse);
        String token = json.get("Token").asText();

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .get("/administradores/1")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void testarBuscarAdministradoresSemToken() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .get("/administradores"))
                .andExpect(status().isUnauthorized());
    }
}
