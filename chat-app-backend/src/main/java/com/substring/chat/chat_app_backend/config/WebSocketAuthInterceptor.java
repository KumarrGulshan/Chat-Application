package com.substring.chat.chat_app_backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.messaging.simp.stomp.StompCommand;

import com.substring.chat.chat_app_backend.security.JwtUtil;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) return message;

        // 🔵 Only process CONNECT frames
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader = accessor.getFirstNativeHeader("Authorization");

            System.out.println("===== WebSocket CONNECT HEADERS =====");
            System.out.println("Authorization Header = " + authHeader);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("❌ No JWT token in CONNECT headers");
                return message; // do NOT block; controller will reject unauthorized
            }

            try {
                String token = authHeader.substring(7);

                // 🔥 Correct method call
                String username = jwtUtil.validateAndGetSubject(token);

                System.out.println("✔ WebSocket Auth Success! Username = " + username);

                // Attach authenticated principal
                accessor.setUser(() -> username);

            } catch (Exception e) {
                System.out.println("❌ Invalid JWT in WebSocket CONNECT: " + e.getMessage());
                return message;
            }
        }

        return message;
    }
}
