package com.nocta.guIA.dtos.ollama;

import java.util.UUID;

public interface RetrievalProjection {
    UUID getId();
    String getInputText();
    String getVectorString();
}