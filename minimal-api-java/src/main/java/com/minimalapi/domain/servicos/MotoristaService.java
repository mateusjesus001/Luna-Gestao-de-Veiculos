package com.minimalapi.domain.servicos;

import com.minimalapi.domain.entidades.Motorista;
import com.minimalapi.infraestrutura.repositorios.MotoristaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MotoristaService implements IMotoristaService {

    private static final int ITENS_POR_PAGINA = 10;

    private final MotoristaRepository repositorio;

    public MotoristaService(MotoristaRepository repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public List<Motorista> todos() {
        return repositorio.findAll();
    }

    @Override
    public List<Motorista> todosPagina(Integer pagina) {
        if (pagina != null) {
            return repositorio.findAll(PageRequest.of(pagina - 1, ITENS_POR_PAGINA)).getContent();
        }
        return repositorio.findAll();
    }

    @Override
    public Motorista buscaPorId(Integer id) {
        return repositorio.findById(id).orElse(null);
    }

    @Override
    public Motorista incluir(Motorista motorista) {
        return repositorio.save(motorista);
    }

    @Override
    public Motorista atualizar(Motorista motorista) {
        if (!repositorio.existsById(motorista.getId())) {
            return null;
        }
        return repositorio.save(motorista);
    }

    @Override
    public void apagar(Integer id) {
        if (repositorio.existsById(id)) {
            repositorio.deleteById(id);
        }
    }
}
