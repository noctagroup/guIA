package com.nocta.guIA.dtos.ollama;

/**
 * DTO para a requisição de embedding para a API do Ollama.
 */
public record OllamaEmbeddingRequest(
        String model,
        String prompt
) {
}
