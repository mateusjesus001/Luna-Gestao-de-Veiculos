package com.minimalapi.api;

import com.minimalapi.domain.dto.MotoristaDTO;
import com.minimalapi.domain.entidades.Motorista;
import com.minimalapi.domain.modelviews.ErrosDeValidacao;
import com.minimalapi.domain.servicos.IMotoristaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/motoristas")
public class MotoristaController {

    private final IMotoristaService motoristaServico;

    public MotoristaController(IMotoristaService motoristaServico) {
        this.motoristaServico = motoristaServico;
    }

    @GetMapping
    public ResponseEntity<List<Motorista>> todos(@RequestParam(required = false) Integer pagina) {
        if (pagina != null) {
            return ResponseEntity.ok(motoristaServico.todosPagina(pagina));
        }
        return ResponseEntity.ok(motoristaServico.todos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Motorista> buscaPorId(@PathVariable Integer id) {
        Motorista motorista = motoristaServico.buscaPorId(id);
        if (motorista == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(motorista);
    }

    @PostMapping
    public ResponseEntity<?> incluir(@RequestBody MotoristaDTO motoristaDTO) {
        Motorista motorista = new Motorista();
        motorista.setNome(motoristaDTO.nome());
        motorista.setFuncao(motoristaDTO.funcao());
        motorista.setTelefone(motoristaDTO.telefone());
        motorista.setEmail(motoristaDTO.email());
        motorista.setQtdViagem(motoristaDTO.qtdViagem());
        motorista.setViagem(motoristaDTO.qtdViagem());
        motorista.setPontuacao(motoristaDTO.pontuacao());
        motorista.setStatus(motoristaDTO.status());
        motorista.setVeiculo(motoristaDTO.veiculo());

        motorista = motoristaServico.incluir(motorista);

        return ResponseEntity.status(HttpStatus.CREATED).body(motorista);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualiza(@PathVariable Integer id, @RequestBody MotoristaDTO motoristaDTO) {
        Motorista motorista = motoristaServico.buscaPorId(id);
        if (motorista == null) {
            return ResponseEntity.notFound().build();
        }

        motorista.setNome(motoristaDTO.nome());
        motorista.setFuncao(motoristaDTO.funcao());
        motorista.setTelefone(motoristaDTO.telefone());
        motorista.setEmail(motoristaDTO.email());
        motorista.setQtdViagem(motoristaDTO.qtdViagem());
        motorista.setViagem(motoristaDTO.qtdViagem());
        motorista.setPontuacao(motoristaDTO.pontuacao());
        motorista.setStatus(motoristaDTO.status());
        motorista.setVeiculo(motoristaDTO.veiculo());

        motorista = motoristaServico.atualizar(motorista);

        if (motorista == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(motorista);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> apagar(@PathVariable Integer id) {
        Motorista motorista = motoristaServico.buscaPorId(id);
        if (motorista == null) {
            return ResponseEntity.notFound().build();
        }
        motoristaServico.apagar(id);
        return ResponseEntity.noContent().build();
    }
}
