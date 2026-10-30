package com.minimalapi.infraestrutura.repositorios;

import com.minimalapi.domain.entidades.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {

    Optional<Administrador> findByEmail(String email);

    Optional<Administrador> findFirstByEmailAndSenha(String email, String senha);
}
