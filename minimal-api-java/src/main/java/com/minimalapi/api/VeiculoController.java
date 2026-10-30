package com.minimalapi.api;

import com.minimalapi.domain.dto.VeiculoDTO;
import com.minimalapi.domain.entidades.Veiculo;
import com.minimalapi.domain.modelviews.ErrosDeValidacao;
import com.minimalapi.domain.servicos.IVeiculoServico;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/veiculos")
@SecurityRequirement(name = "bearerAuth")
public class VeiculoController {

    private final IVeiculoServico veiculoServico;

    public VeiculoController(IVeiculoServico veiculoServico) {
        this.veiculoServico = veiculoServico;
    }

    @PostMapping
    public ResponseEntity<?> incluir(@Valid @RequestBody VeiculoDTO veiculoDTO) {
        ErrosDeValidacao validacao = validaDTO(veiculoDTO);
        if (!validacao.getMensagens().isEmpty()) {
            return ResponseEntity.badRequest().body(validacao);
        }

        Veiculo veiculo = new Veiculo();
        veiculo.setNome(veiculoDTO.nome());
        veiculo.setMarca(veiculoDTO.marca());
        veiculo.setAno(veiculoDTO.ano());

        veiculo = veiculoServico.incluir(veiculo);

        return ResponseEntity.status(HttpStatus.CREATED).body(veiculo);
    }

    @GetMapping
    public ResponseEntity<List<Veiculo>> todos(@RequestParam(required = false) Integer pagina) {
        return ResponseEntity.ok(veiculoServico.todos(pagina));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Veiculo> buscaPorId(@PathVariable Integer id) {
        Veiculo veiculo = veiculoServico.buscaPorId(id);
        if (veiculo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(veiculo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualiza(@PathVariable Integer id, @Valid @RequestBody VeiculoDTO veiculoDTO) {
        Veiculo veiculo = veiculoServico.buscaPorId(id);
        if (veiculo == null) {
            return ResponseEntity.notFound().build();
        }

        ErrosDeValidacao validacao = validaDTO(veiculoDTO);
        if (!validacao.getMensagens().isEmpty()) {
            return ResponseEntity.badRequest().body(validacao);
        }

        veiculo.setNome(veiculoDTO.nome());
        veiculo.setMarca(veiculoDTO.marca());
        veiculo.setAno(veiculoDTO.ano());

        veiculo = veiculoServico.atualizar(veiculo);

        return ResponseEntity.ok(veiculo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> apagar(@PathVariable Integer id) {
        Veiculo veiculo = veiculoServico.buscaPorId(id);
        if (veiculo == null) {
            return ResponseEntity.notFound().build();
        }
        veiculoServico.apagar(veiculo);
        return ResponseEntity.noContent().build();
    }

    private ErrosDeValidacao validaDTO(VeiculoDTO veiculoDTO) {
        ErrosDeValidacao validacao = new ErrosDeValidacao(new ArrayList<>());
        if (veiculoDTO.nome() == null || veiculoDTO.nome().trim().isEmpty()) {
            validacao.getMensagens().add("O nome não pode ser vazio");
        }
        if (veiculoDTO.marca() == null || veiculoDTO.marca().trim().isEmpty()) {
            validacao.getMensagens().add("A marca não pode ficar em branco");
        }
        if (veiculoDTO.ano() < 1950) {
            validacao.getMensagens().add("Veiculo muito antigo, aceito apenas anos superiores a 1950");
        }
        return validacao;
    }
}
