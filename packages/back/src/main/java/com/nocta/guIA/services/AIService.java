package com.nocta.guIA.services;

import com.nocta.guIA.dtos.ollama.OllamaEmbeddingRequest;
import com.nocta.guIA.dtos.ollama.OllamaEmbeddingResponse;
import com.nocta.guIA.dtos.ollama.OllamaGenerationRequest;
import com.nocta.guIA.dtos.ollama.OllamaGenerationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import tools.jackson.databind.ObjectMapper;

@Service
public class AIService {

    private static final Logger log = LoggerFactory.getLogger(AIService.class);

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private static final String MODELO_EMBEDDING = "nomic-embed-text";
    private static final String MODELO_GERACAO = "phi3:mini";

    public AIService(@Value("${ollama.api.base-url}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Gera um embedding usando o WebClient (Migrado).
     * Nota: Usa .block() para ser síncrono em um @Service.
     *
     * @param text O texto a ser transformado em embedding.
     * @return Um array de float representando o embedding do texto.
     */
    public float[] getEmbedding(String text) {
        OllamaEmbeddingRequest request = new OllamaEmbeddingRequest(MODELO_EMBEDDING, text);

        OllamaEmbeddingResponse response = webClient.post()
                .uri("/api/embeddings")
                .bodyValue(request) // Usa bodyValue do WebClient
                .retrieve()
                .bodyToMono(OllamaEmbeddingResponse.class) // Usa Mono para resposta síncrona
                .block(); // Bloqueia a execução até a resposta chegar

        return response != null ? response.embedding() : null;
    }

    /**
     * Consome a resposta do Ollama em stream usando WebClient (Corrigido).
     *
     * @param prompt O prompt completo.
     * @return Um Flux<String> com os chunks de texto gerados.
     */
    public Flux<String> streamGenerateResponse(String prompt) {
        OllamaGenerationRequest request = new OllamaGenerationRequest(MODELO_GERACAO, prompt, true);

        return webClient.post() // Usa WebClient
                .uri("/api/generate")
                .bodyValue(request) // Envia o corpo
                .retrieve()


                .bodyToFlux(String.class)

                .map(json -> {
                    try {
                        OllamaGenerationResponse responseChunk = this.objectMapper.readValue(json, OllamaGenerationResponse.class);

                        return responseChunk.response();
                    } catch (Exception e) {
                        log.error("Erro ao mapear chunk JSON: {}", json, e);
                        return "";
                    }
                })
                .filter(response -> response != null && !response.isEmpty());
    }
}
