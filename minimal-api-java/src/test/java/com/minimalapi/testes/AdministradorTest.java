package com.minimalapi.testes;

import com.minimalapi.domain.entidades.Administrador;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class AdministradorTest {

    @Test
    void testarGetSetPropriedades() {
        Administrador adm = new Administrador();
        adm.setId(1);
        adm.setEmail("teste@teste.com");
        adm.setSenha("teste");
        adm.setPerfil("Adm");

        assertEquals(1, adm.getId());
        assertEquals("teste@teste.com", adm.getEmail());
        assertEquals("teste", adm.getSenha());
        assertEquals("Adm", adm.getPerfil());
    }

    @Test
    void testarConstrutor() {
        Administrador adm = new Administrador(1, "adm@teste.com", "123456", "Adm");

        assertEquals(1, adm.getId());
        assertEquals("adm@teste.com", adm.getEmail());
        assertEquals("123456", adm.getSenha());
        assertEquals("Adm", adm.getPerfil());
    }
}
