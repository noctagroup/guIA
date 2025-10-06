package com.nocta.guIA.dtos.ollama;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * DTO para a resposta de geração de texto da API do Ollama (em modo stream).
 * O campo 'done' é ignorado, pois só nos importamos com o conteúdo da resposta.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record OllamaGenerationResponse(
        String response
) {
}
