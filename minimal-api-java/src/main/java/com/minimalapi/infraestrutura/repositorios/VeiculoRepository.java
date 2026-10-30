package com.minimalapi.infraestrutura.repositorios;

import com.minimalapi.domain.entidades.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VeiculoRepository extends JpaRepository<Veiculo, Integer> {
}
