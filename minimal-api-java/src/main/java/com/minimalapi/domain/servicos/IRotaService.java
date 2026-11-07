package com.minimalapi.domain.servicos;

import com.minimalapi.domain.entidades.Rota;

import java.util.List;

public interface IRotaService {
    List<Rota> todos();
    List<Rota> todosPagina(Integer pagina);
    Rota buscaPorId(Integer id);
    Rota incluir(Rota rota);
    Rota atualizar(Rota rota);
    void apagar(Integer id);
}
