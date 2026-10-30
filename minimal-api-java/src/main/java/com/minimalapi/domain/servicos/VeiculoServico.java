package com.minimalapi.domain.servicos;

import com.minimalapi.domain.entidades.Veiculo;
import com.minimalapi.infraestrutura.repositorios.VeiculoRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VeiculoServico implements IVeiculoServico {

    private static final int ITENS_POR_PAGINA = 10;

    private final VeiculoRepository repositorio;

    public VeiculoServico(VeiculoRepository repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public List<Veiculo> todos(Integer pagina) {
        if (pagina != null) {
            return repositorio.findAll(PageRequest.of(pagina - 1, ITENS_POR_PAGINA)).getContent();
        }
        return repositorio.findAll();
    }

    @Override
    public Veiculo buscaPorId(Integer id) {
        return repositorio.findById(id).orElse(null);
    }

    @Override
    public Veiculo incluir(Veiculo veiculo) {
        return repositorio.save(veiculo);
    }

    @Override
    public Veiculo atualizar(Veiculo veiculo) {
        return repositorio.save(veiculo);
    }

    @Override
    public void apagar(Veiculo veiculo) {
        repositorio.delete(veiculo);
    }
}
