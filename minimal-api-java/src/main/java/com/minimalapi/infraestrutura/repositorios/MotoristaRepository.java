package com.minimalapi.infraestrutura.repositorios;

import com.minimalapi.domain.entidades.Motorista;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MotoristaRepository extends JpaRepository<Motorista, Integer> {
}
