package com.minimalapi.domain.entidades;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "administradores")
public class Administrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("Id")
    private Integer id;

    @Column(name = "Email", nullable = false, length = 255)
    @JsonProperty("Email")
    private String email;

    @Column(name = "Senha", nullable = false, length = 50)
    @JsonProperty("Senha")
    private String senha;

    @Column(name = "Perfil", nullable = false, length = 10)
    @JsonProperty("Perfil")
    private String perfil;

    public Administrador() {
    }

    public Administrador(Integer id, String email, String senha, String perfil) {
        this.id = id;
        this.email = email;
        this.senha = senha;
        this.perfil = perfil;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }
}
