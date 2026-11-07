package com.minimalapi.infraestrutura.repositorios;

import com.minimalapi.domain.entidades.Rota;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RotaRepository extends JpaRepository<Rota, Integer> {
}
