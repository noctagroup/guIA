package com.nocta.guIA.entities;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class Projeto {
    private String nome;
    private String descricao;
    private List<String> tecnologias;
}
