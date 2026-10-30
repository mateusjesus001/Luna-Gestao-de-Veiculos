package com.minimalapi.domain.servicos;

import com.minimalapi.domain.dto.LoginDTO;
import com.minimalapi.domain.entidades.Administrador;
import com.minimalapi.infraestrutura.repositorios.AdministradorRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdministradorServico implements IAdministradorServico {

    private static final int ITENS_POR_PAGINA = 10;

    private final AdministradorRepository repositorio;

    public AdministradorServico(AdministradorRepository repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public Administrador login(LoginDTO loginDTO) {
        System.out.println("DEBUG LOGIN - email: " + loginDTO.email() + ", senha: " + loginDTO.senha());
        Administrador admin = repositorio.findFirstByEmailAndSenha(loginDTO.email().trim(), loginDTO.senha()).orElse(null);
        System.out.println("DEBUG LOGIN - result: " + admin);
        return admin;
    }

    @Override
    public Administrador incluir(Administrador administrador) {
        return repositorio.save(administrador);
    }

    @Override
    public List<Administrador> todos(Integer pagina) {
        if (pagina != null) {
            return repositorio.findAll(PageRequest.of(pagina - 1, ITENS_POR_PAGINA)).getContent();
        }
        return repositorio.findAll();
    }

    @Override
    public Administrador buscaPorId(Integer id) {
        return repositorio.findById(id).orElse(null);
    }
}
