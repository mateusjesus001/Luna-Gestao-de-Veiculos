package com.minimalapi.api;

import com.minimalapi.domain.dto.RotaDTO;
import com.minimalapi.domain.entidades.Rota;
import com.minimalapi.domain.servicos.IRotaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rotas")
public class RotaController {

    private final IRotaService rotaServico;

    public RotaController(IRotaService rotaServico) {
        this.rotaServico = rotaServico;
    }

    @GetMapping
    public ResponseEntity<List<Rota>> todos(@RequestParam(required = false) Integer pagina) {
        if (pagina != null) {
            return ResponseEntity.ok(rotaServico.todosPagina(pagina));
        }
        return ResponseEntity.ok(rotaServico.todos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rota> buscaPorId(@PathVariable Integer id) {
        Rota rota = rotaServico.buscaPorId(id);
        if (rota == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(rota);
    }

    @PostMapping
    public ResponseEntity<?> incluir(@RequestBody RotaDTO rotaDTO) {
        Rota rota = new Rota();
        rota.setOrigem(rotaDTO.origem());
        rota.setDestino(rotaDTO.destino());
        rota.setVeiculo(rotaDTO.veiculo());
        rota.setMotorista(rotaDTO.motorista());
        rota.setHorario(rotaDTO.horario());
        rota.setDistancia(rotaDTO.distancia());
        rota.setStatus(rotaDTO.status());

        rota = rotaServico.incluir(rota);

        return ResponseEntity.status(HttpStatus.CREATED).body(rota);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualiza(@PathVariable Integer id, @RequestBody RotaDTO rotaDTO) {
        Rota rota = rotaServico.buscaPorId(id);
        if (rota == null) {
            return ResponseEntity.notFound().build();
        }

        rota.setOrigem(rotaDTO.origem());
        rota.setDestino(rotaDTO.destino());
        rota.setVeiculo(rotaDTO.veiculo());
        rota.setMotorista(rotaDTO.motorista());
        rota.setHorario(rotaDTO.horario());
        rota.setDistancia(rotaDTO.distancia());
        rota.setStatus(rotaDTO.status());

        rota = rotaServico.atualizar(rota);

        if (rota == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(rota);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> apagar(@PathVariable Integer id) {
        Rota rota = rotaServico.buscaPorId(id);
        if (rota == null) {
            return ResponseEntity.notFound().build();
        }
        rotaServico.apagar(id);
        return ResponseEntity.noContent().build();
    }
}
