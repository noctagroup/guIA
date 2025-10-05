package com.nocta.guIA.dtos.ollama;

/**
 * DTO para a requisição de geração de texto para a API do Ollama.
 */
public record OllamaGenerationRequest(
        String model,
        String prompt,
        boolean stream
) {
}
