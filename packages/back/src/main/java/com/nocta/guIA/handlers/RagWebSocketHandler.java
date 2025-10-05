package com.nocta.guIA.handlers;

import com.nocta.guIA.dtos.rag.AskRequestDTO;
import com.nocta.guIA.entities.Retrieval;
import com.nocta.guIA.services.AIService;
import com.nocta.guIA.services.RagService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Component
public class RagWebSocketHandler extends TextWebSocketHandler {

    private static final Logger LOGGER = Logger.getLogger(RagWebSocketHandler.class.getName());

    private final RagService ragService;
    private final AIService aiService;
    private final ObjectMapper objectMapper;

    public RagWebSocketHandler(RagService ragService, AIService aiService, ObjectMapper objectMapper) {
        this.ragService = ragService;
        this.objectMapper = objectMapper;
        this.aiService = aiService;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            AskRequestDTO askRequest = objectMapper.readValue(message.getPayload(), AskRequestDTO.class);
            this.ask(askRequest.pergunta(), session);
        } catch (Exception e) {
            session.sendMessage(new TextMessage("Erro ao processar a pergunta: " + e.getMessage()));
            session.close(CloseStatus.BAD_DATA.withReason(e.getMessage()));
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        session.sendMessage(new TextMessage("Conexão estabelecida."));
    }

    private void ask(String query, WebSocketSession session) {
        try {
            // 1. Gerar o embedding para a pergunta do usuário
            // ADICIONE UM LOG AQUI COM A QUERY
            LOGGER.info("Processing RAG query: " + query);
            float[] queryEmbedding = aiService.getEmbedding(query);

            if (queryEmbedding == null) {
                throw new RuntimeException("Não foi possível gerar o embedding para a pergunta.");
            }

            // 2. Buscar os 3 contextos mais relevantes no banco de dados
            String context = ragService.makeContext(queryEmbedding, 3);
            LOGGER.info("Context: " + context);

            // 3. Montar o prompt final para o modelo de linguagem
            String finalPrompt = String.format("""
                       Você é um assistente prestativo, está aqui para ajudar pessoas a acharem projetos pelas quais se interessam em um evento. Use o seguinte contexto para responder à pergunta do usuário.
                       Se a resposta não estiver no contexto, diga que você não sabe. Lembre-se de dizer a localização sempre e uma breve descrição caso exista no contexto.
                    
                       Contexto:
                       %s
                    
                       Pergunta do Usuário:
                       %s
                    """, context, query);

            // 4. Chamar o serviço de IA para obter a resposta em stream e enviá-la via WebSocket
            aiService.streamGenerateResponse(finalPrompt).doOnNext(token -> {
                try {
                    session.sendMessage(new TextMessage(token));
                } catch (IOException e) {
                    throw new RuntimeException("Falha ao enviar mensagem via WebSocket", e);
                }
            }).doOnComplete(() -> {
                try {
                    session.close();
                } catch (IOException e) {
                    // Ignora erros ao fechar a sessão
                }
            }).doOnError(error -> {
                try {
                    session.sendMessage(new TextMessage("Erro no stream: " + error.getMessage()));
                    session.close();
                } catch (IOException e) {
                    // Ignora erros ao fechar a sessão
                }
            }).subscribe();

        } catch (Exception e) {
            try {
                session.sendMessage(new TextMessage("Ocorreu um erro geral: " + e.getMessage()));
                session.close();
            } catch (IOException ioException) {
                // Ignora erros ao fechar a sessão
            }
        }
    }
}
