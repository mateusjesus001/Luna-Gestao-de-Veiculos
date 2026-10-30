package com.minimalapi.domain.servicos;

import com.minimalapi.domain.entidades.Veiculo;

import java.util.List;

public interface IVeiculoServico {

    List<Veiculo> todos(Integer pagina);

    Veiculo buscaPorId(Integer id);

    Veiculo incluir(Veiculo veiculo);

    Veiculo atualizar(Veiculo veiculo);

    void apagar(Veiculo veiculo);
}
