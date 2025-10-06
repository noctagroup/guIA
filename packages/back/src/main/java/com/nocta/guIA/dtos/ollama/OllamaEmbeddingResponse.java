package com.nocta.guIA.dtos.ollama;

/**
 * DTO para a resposta de embedding da API do Ollama.
 */
public record OllamaEmbeddingResponse(
        float[] embedding
) {
}
