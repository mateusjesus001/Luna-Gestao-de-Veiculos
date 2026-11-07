package com.minimalapi.testes;

import com.minimalapi.domain.servicos.IAdministradorServico;
import com.minimalapi.domain.servicos.IVeiculoServico;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class Setup {

    @Bean
    @Primary
    public IAdministradorServico administradorServicoMock() {
        return new AdministradorServicoMock();
    }

    @Bean
    @Primary
    public IVeiculoServico veiculoServicoMock() {
        return new VeiculoServicoMock();
    }
}
