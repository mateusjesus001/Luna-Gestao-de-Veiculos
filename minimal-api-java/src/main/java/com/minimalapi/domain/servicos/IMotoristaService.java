package com.minimalapi.domain.servicos;

import com.minimalapi.domain.entidades.Motorista;

import java.util.List;

public interface IMotoristaService {
    List<Motorista> todos();
    List<Motorista> todosPagina(Integer pagina);
    Motorista buscaPorId(Integer id);
    Motorista incluir(Motorista motorista);
    Motorista atualizar(Motorista motorista);
    void apagar(Integer id);
}
