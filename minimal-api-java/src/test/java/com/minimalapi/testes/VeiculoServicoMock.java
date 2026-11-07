package com.minimalapi.testes;

import com.minimalapi.domain.entidades.Veiculo;
import com.minimalapi.domain.servicos.IVeiculoServico;

import java.util.ArrayList;
import java.util.List;

public class VeiculoServicoMock implements IVeiculoServico {

    private final List<Veiculo> veiculos = new ArrayList<>();

    public VeiculoServicoMock() {
        veiculos.add(new Veiculo(1, "Opala", "Chevrolet", 1974));
    }

    @Override
    public List<Veiculo> todos(Integer pagina) {
        return veiculos;
    }

    @Override
    public Veiculo buscaPorId(Integer id) {
        return veiculos.stream()
                .filter(v -> v.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public Veiculo incluir(Veiculo veiculo) {
        veiculo.setId(veiculos.size() + 1);
        veiculos.add(veiculo);
        return veiculo;
    }

    @Override
    public Veiculo atualizar(Veiculo veiculo) {
        Veiculo existente = buscaPorId(veiculo.getId());
        if (existente != null) {
            existente.setNome(veiculo.getNome());
            existente.setMarca(veiculo.getMarca());
            existente.setAno(veiculo.getAno());
            return existente;
        }
        return null;
    }

    @Override
    public void apagar(Veiculo veiculo) {
        veiculos.removeIf(v -> v.getId().equals(veiculo.getId()));
    }
}
