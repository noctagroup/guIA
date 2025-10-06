package com.nocta.guIA.dtos.inscricao;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CreateInscricaoDTO(
        @NotBlank(message = "Nome do grupo não pode estar em branco")
        String nomeGrupo,
        @NotEmpty(message = "A lista de integrantes não pode estar vazia")
        List<String> integrantes,
        @NotBlank(message = "Semestre não pode estar em branco")
        String semestre,
        @Valid
        ProjetoDTO projeto,
        @Valid
        LocalizacaoDTO localizacao
) {
}
