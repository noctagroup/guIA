package com.nocta.guIA.services;

import com.nocta.guIA.dtos.ollama.RetrievalProjection;
import com.nocta.guIA.entities.Retrieval;
import com.nocta.guIA.repositories.RetrievalRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class RagService {
    private final RetrievalRepository repository;

    public RagService(RetrievalRepository repository) {
        this.repository = repository;
    }

    public void createRetrieval(String textoBase, float[] embedding) {
        this.repository.insertRetrieval(textoBase, embedding);
    }

    public String makeContext(float[] queryEmbedding, int limit) {
        var mostSimilar = repository.findMostSimilar(convertFloatArrayToString(queryEmbedding), limit);
        String context = mostSimilar.stream()
                .map(RetrievalProjection::getInputText)
                .collect(Collectors.joining("\n---\n"));

        return context;
    }

    private String convertFloatArrayToString(float[] vector) {
        if (vector == null || vector.length == 0) {
            return "[]";
        }

        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < vector.length; i++) {
            sb.append(vector[i]);
            if (i < vector.length - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }
}
