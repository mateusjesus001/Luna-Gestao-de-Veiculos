package com.minimalapi.domain.servicos;

import com.minimalapi.domain.entidades.Rota;
import com.minimalapi.infraestrutura.repositorios.RotaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RotaService implements IRotaService {

    private static final int ITENS_POR_PAGINA = 10;

    private final RotaRepository repositorio;

    public RotaService(RotaRepository repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public List<Rota> todos() {
        return repositorio.findAll();
    }

    @Override
    public List<Rota> todosPagina(Integer pagina) {
        if (pagina != null) {
            return repositorio.findAll(PageRequest.of(pagina - 1, ITENS_POR_PAGINA)).getContent();
        }
        return repositorio.findAll();
    }

    @Override
    public Rota buscaPorId(Integer id) {
        return repositorio.findById(id).orElse(null);
    }

    @Override
    public Rota incluir(Rota rota) {
        return repositorio.save(rota);
    }

    @Override
    public Rota atualizar(Rota rota) {
        if (!repositorio.existsById(rota.getId())) {
            return null;
        }
        return repositorio.save(rota);
    }

    @Override
    public void apagar(Integer id) {
        if (repositorio.existsById(id)) {
            repositorio.deleteById(id);
        }
    }
}
