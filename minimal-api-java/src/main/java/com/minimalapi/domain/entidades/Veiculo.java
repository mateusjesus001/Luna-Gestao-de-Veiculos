package com.minimalapi.domain.entidades;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "veiculos")
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("Id")
    private Integer id;

    @Column(name = "Nome", nullable = false, length = 150)
    @JsonProperty("Nome")
    private String nome;

    @Column(name = "Marca", nullable = false, length = 100)
    @JsonProperty("Marca")
    private String marca;

    @Column(name = "Ano", nullable = false)
    @JsonProperty("Ano")
    private Integer ano;

    public Veiculo() {
    }

    public Veiculo(Integer id, String nome, String marca, Integer ano) {
        this.id = id;
        this.nome = nome;
        this.marca = marca;
        this.ano = ano;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }
}
