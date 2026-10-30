package com.minimalapi.domain.servicos;

import com.minimalapi.domain.dto.LoginDTO;
import com.minimalapi.domain.entidades.Administrador;

import java.util.List;

public interface IAdministradorServico {

    Administrador login(LoginDTO loginDTO);

    Administrador incluir(Administrador administrador);

    List<Administrador> todos(Integer pagina);

    Administrador buscaPorId(Integer id);
}
