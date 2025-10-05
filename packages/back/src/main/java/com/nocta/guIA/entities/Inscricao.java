package com.nocta.guIA.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Inscricao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String nomeGrupo;

    @ElementCollection
    private List<String> integrantes;

    @Embedded
    private Projeto projeto;

    @Embedded
    private Localizacao localizacao;
}
