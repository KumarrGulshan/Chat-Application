package com.substring.chat.chat_app_backend.config;

import com.substring.chat.chat_app_backend.repository.UserRepository;
import com.substring.chat.chat_app_backend.security.AuthChannelInterceptorAdapter;
import com.substring.chat.chat_app_backend.security.JwtUtil;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public WebSocketConfig(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
    // REAL WebSocket endpoint (required for STOMP)
        registry.addEndpoint("/chat")
            .setAllowedOriginPatterns("*");

    // SockJS fallback
        registry.addEndpoint("/chat")
            .setAllowedOriginPatterns("*")
            .withSockJS();
   }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new AuthChannelInterceptorAdapter(jwtUtil, userRepository));
    }
}
