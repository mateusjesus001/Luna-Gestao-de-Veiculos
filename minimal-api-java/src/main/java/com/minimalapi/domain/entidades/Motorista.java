package com.minimalapi.domain.entidades;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "motoristas")
public class Motorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("Id")
    private Integer id;

    @Column(name = "Nome", nullable = false, length = 150)
    @JsonProperty("Nome")
    private String nome;

    @Column(name = "Iniciais", length = 10)
    @JsonProperty("Iniciais")
    private String iniciais;

    @Column(name = "Funcao", length = 50)
    @JsonProperty("Funcao")
    private String funcao;

    @Column(name = "Telefone", length = 20)
    @JsonProperty("Telefone")
    private String telefone;

    @Column(name = "Email", length = 150)
    @JsonProperty("Email")
    private String email;

    @Column(name = "Viagem", nullable = false)
    @JsonProperty("Viagem")
    private Integer viagem;

    @Column(name = "Qtd_Viagem", nullable = false)
    @JsonProperty("Qtd_Viagem")
    private Integer qtdViagem;

    @Column(name = "Pontuacao", nullable = false, precision = 3, scale = 2, columnDefinition = "DECIMAL(3,2)")
    @JsonProperty("Pontuacao")
    private BigDecimal pontuacao;

    @Column(name = "Status", length = 20)
    @JsonProperty("Status")
    private String status;

    @Column(name = "Veiculo", length = 150)
    @JsonProperty("Veiculo")
    private String veiculo;

    public Motorista() {
    }

    public Motorista(Integer id, String nome, String iniciais, String funcao, String telefone,
                     String email, Integer viagem, Integer qtdViagem, BigDecimal pontuacao, String status,
                     String veiculo) {
        this.id = id;
        this.nome = nome;
        this.iniciais = iniciais;
        this.funcao = funcao;
        this.telefone = telefone;
        this.email = email;
        this.viagem = viagem;
        this.qtdViagem = qtdViagem;
        this.pontuacao = pontuacao;
        this.status = status;
        this.veiculo = veiculo;
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

    public String getIniciais() {
        return iniciais;
    }

    public void setIniciais(String iniciais) {
        this.iniciais = iniciais;
    }

    public String getFuncao() {
        return funcao;
    }

    public void setFuncao(String funcao) {
        this.funcao = funcao;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getViagem() {
        return viagem;
    }

    public void setViagem(Integer viagem) {
        this.viagem = viagem;
    }

    public Integer getQtdViagem() {
        return qtdViagem;
    }

    public void setQtdViagem(Integer qtdViagem) {
        this.qtdViagem = qtdViagem;
    }

    public BigDecimal getPontuacao() {
        return pontuacao;
    }

    public void setPontuacao(BigDecimal pontuacao) {
        this.pontuacao = pontuacao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(String veiculo) {
        this.veiculo = veiculo;
    }
}
