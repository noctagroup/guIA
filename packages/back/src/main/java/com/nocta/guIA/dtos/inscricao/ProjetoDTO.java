package com.nocta.guIA.dtos.inscricao;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ProjetoDTO(
        @NotBlank(message = "Nome do projeto não pode estar em branco")
        String nome,
        @NotBlank(message = "Descrição do projeto não pode estar em branco")
        String descricao,
        @NotEmpty(message = "A lista de tecnologias não pode estar vazia")
        List<String> tecnologias
) {
}
