package com.nocta.guIA.dtos.inscricao;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record LocalizacaoDTO(
        @Min(value = 0, message = "Andar deve ser no mínimo 0")
        @Max(value = 3, message = "Andar deve ser no máximo 3")
        int andar,
        int sala
) {
}
