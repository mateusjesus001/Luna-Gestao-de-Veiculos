package com.minimalapi.api;

import com.minimalapi.domain.dto.AdministradorDTO;
import com.minimalapi.domain.dto.LoginDTO;
import com.minimalapi.domain.entidades.Administrador;
import com.minimalapi.domain.modelviews.AdministradorLogado;
import com.minimalapi.domain.modelviews.AdministradorModelView;
import com.minimalapi.domain.modelviews.ErrosDeValidacao;
import com.minimalapi.domain.servicos.IAdministradorServico;
import com.minimalapi.seguranca.JwtService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/administradores")
@SecurityRequirement(name = "bearerAuth")
public class AdministradorController {

    private final IAdministradorServico administradorServico;
    private final JwtService jwtService;

    public AdministradorController(IAdministradorServico administradorServico, JwtService jwtService) {
        this.administradorServico = administradorServico;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO loginDTO) {
        Administrador adm = administradorServico.login(loginDTO);
        if (adm != null) {
            String token = jwtService.gerarToken(adm.getEmail(), adm.getPerfil());
            AdministradorLogado administradorLogado = new AdministradorLogado(adm.getEmail(), adm.getPerfil(), token);
            return ResponseEntity.ok(administradorLogado);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping
    public ResponseEntity<List<AdministradorModelView>> todos(@RequestParam(required = false) Integer pagina) {
        List<AdministradorModelView> adms = new ArrayList<>();
        List<Administrador> administradores = administradorServico.todos(pagina);
        for (Administrador adm : administradores) {
            adms.add(new AdministradorModelView(adm.getId(), adm.getEmail(), adm.getPerfil()));
        }
        return ResponseEntity.ok(adms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdministradorModelView> buscaPorId(@PathVariable Integer id) {
        Administrador administrador = administradorServico.buscaPorId(id);
        if (administrador == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new AdministradorModelView(administrador.getId(), administrador.getEmail(), administrador.getPerfil()));
    }

    @PostMapping
    public ResponseEntity<?> incluir(@Valid @RequestBody AdministradorDTO administradorDTO) {
        ErrosDeValidacao validacao = new ErrosDeValidacao();

        if (administradorDTO.email() == null || administradorDTO.email().trim().isEmpty()) {
            validacao.getMensagens().add("Email não pode ser vazio");
        }

        if (administradorDTO.senha() == null || administradorDTO.senha().trim().isEmpty()) {
            validacao.getMensagens().add("Senha não pode ser vazia");
        }

        if (administradorDTO.perfil() == null) {
            validacao.getMensagens().add("Perfil não pode ser vazio");
        }

        if (!validacao.getMensagens().isEmpty()) {
            return ResponseEntity.badRequest().body(validacao);
        }

        Administrador administrador = new Administrador();
        administrador.setEmail(administradorDTO.email());
        administrador.setSenha(administradorDTO.senha());
        administrador.setPerfil(administradorDTO.perfil());

        administrador = administradorServico.incluir(administrador);

        AdministradorModelView modelView = new AdministradorModelView(administrador.getId(), administrador.getEmail(), administrador.getPerfil());
        return ResponseEntity.status(HttpStatus.CREATED).body(modelView);
    }
}
