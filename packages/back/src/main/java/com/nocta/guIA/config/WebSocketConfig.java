package com.nocta.guIA.config;

import com.nocta.guIA.handlers.RagWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final RagWebSocketHandler ragWebSocketHandler;

    public WebSocketConfig(RagWebSocketHandler ragWebSocketHandler) {
        this.ragWebSocketHandler = ragWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(ragWebSocketHandler, "/ask")
                .setAllowedOrigins("*");
    }
}
