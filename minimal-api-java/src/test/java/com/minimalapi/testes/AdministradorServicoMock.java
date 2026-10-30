package com.minimalapi.testes;

import com.minimalapi.domain.dto.LoginDTO;
import com.minimalapi.domain.entidades.Administrador;
import com.minimalapi.domain.servicos.IAdministradorServico;

import java.util.ArrayList;
import java.util.List;

public class AdministradorServicoMock implements IAdministradorServico {

    private static final List<Administrador> administradores = new ArrayList<>();

    static {
        administradores.add(new Administrador(1, "adm@teste.com", "123456", "Adm"));
        administradores.add(new Administrador(2, "editor@teste.com", "123456", "Editor"));
    }

    @Override
    public Administrador login(LoginDTO loginDTO) {
        return administradores.stream()
                .filter(a -> a.getEmail().equals(loginDTO.email()) && a.getSenha().equals(loginDTO.senha()))
                .findFirst()
                .orElse(null);
    }

    @Override
    public Administrador incluir(Administrador administrador) {
        administrador.setId(administradores.size() + 1);
        administradores.add(administrador);
        return administrador;
    }

    @Override
    public List<Administrador> todos(Integer pagina) {
        return administradores;
    }

    @Override
    public Administrador buscaPorId(Integer id) {
        return administradores.stream()
                .filter(a -> a.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
