package com.anasqadri_dev.chat_app.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // this will be going to enable web-socket messaging.
// message broking is way to routing messages, message is like a middle-man which direct the messages to the right place
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    // WebSocket enable real-time connection
    // STOMP is used to organize and route messages within that connection, it makes it easier for handling chat-rooms

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat")
                .setAllowedOrigins("http://localhost:8080")
                .withSockJS(); // it is going to add compatibility for the clients which do not support web socket
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
//        set message broker
        registry.enableSimpleBroker("/topic");
//        expect message with /app/sendMessage
        registry.setApplicationDestinationPrefixes("/app");
    }
}
