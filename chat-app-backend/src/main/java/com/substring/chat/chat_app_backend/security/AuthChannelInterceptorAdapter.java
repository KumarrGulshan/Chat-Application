package com.substring.chat.chat_app_backend.security;

import com.substring.chat.chat_app_backend.repository.UserRepository;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.List;

public class AuthChannelInterceptorAdapter implements ChannelInterceptor {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthChannelInterceptorAdapter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        StompCommand command = accessor.getCommand();

        // Only intercept CONNECT, SEND, SUBSCRIBE
        if (command == StompCommand.CONNECT) {
            handleConnect(accessor);
        } else if (command == StompCommand.SEND || command == StompCommand.SUBSCRIBE) {
            if (accessor.getUser() == null) {
                throw new IllegalArgumentException("Unauthorized user!");
            }
        }

        return message;
    }

    private void handleConnect(StompHeaderAccessor accessor) {
        String authHeader = accessor.getFirstNativeHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        try {
            String username = jwtUtil.validateAndGetSubject(token);

            if (username != null && userRepository.findByUsername(username) != null) {
                // No roles yet; you can add roles if your User entity has them
                accessor.setUser(new UsernamePasswordAuthenticationToken(username, null, List.of()));
            } else {
                throw new IllegalArgumentException("Invalid token or user");
            }
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid token");
        }
    }
}
