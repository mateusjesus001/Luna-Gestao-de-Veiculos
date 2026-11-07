package com.minimalapi.domain.entidades;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "rotas")
public class Rota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("Id")
    private Integer id;

    @Column(name = "Origem", nullable = false, length = 255)
    @JsonProperty("Origem")
    private String origem;

    @Column(name = "Destino", nullable = false, length = 255)
    @JsonProperty("Destino")
    private String destino;

    @Column(name = "Veiculo", length = 150)
    @JsonProperty("Veiculo")
    private String veiculo;

    @Column(name = "Motorista", length = 150)
    @JsonProperty("Motorista")
    private String motorista;

    @Column(name = "Horario", length = 50)
    @JsonProperty("Horario")
    private String horario;

    @Column(name = "Distancia", length = 20)
    @JsonProperty("Distancia")
    private String distancia;

    @Column(name = "Status", length = 20)
    @JsonProperty("Status")
    private String status;

    public Rota() {
    }

    public Rota(Integer id, String origem, String destino, String veiculo, String motorista,
                String horario, String distancia, String status) {
        this.id = id;
        this.origem = origem;
        this.destino = destino;
        this.veiculo = veiculo;
        this.motorista = motorista;
        this.horario = horario;
        this.distancia = distancia;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(String origem) {
        this.origem = origem;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public String getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(String veiculo) {
        this.veiculo = veiculo;
    }

    public String getMotorista() {
        return motorista;
    }

    public void setMotorista(String motorista) {
        this.motorista = motorista;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public String getDistancia() {
        return distancia;
    }

    public void setDistancia(String distancia) {
        this.distancia = distancia;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
