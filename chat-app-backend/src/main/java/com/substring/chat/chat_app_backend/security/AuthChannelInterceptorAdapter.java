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

        if (command == StompCommand.CONNECT) {
            handleConnect(accessor);
        }
        else if (command == StompCommand.SEND) {
            handleSend(accessor);
        }

        return message;
    }

    /**
     * Handles authentication during WebSocket CONNECT frame.
     * Extracts token → validates → loads user → stores user in session.
     */
    private void handleConnect(StompHeaderAccessor accessor) {

        String authHeader = accessor.getFirstNativeHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        String username;
        try {
            username = jwtUtil.validateAndGetSubject(token);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid token");
        }

        if (username == null || userRepository.findByUsername(username) == null) {
            throw new IllegalArgumentException("User not found or invalid token");
        }

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(username, null, List.of());

        // Set authenticated user on WebSocket connection
        accessor.setUser(auth);

        // ⭐ Store user in session for future SEND messages
        accessor.getSessionAttributes().put("user", auth);
    }

    /**
     * Handles authentication during SEND frame.
     * Loads the user stored in session from CONNECT step.
     */
    private void handleSend(StompHeaderAccessor accessor) {
        Object sessionUser = accessor.getSessionAttributes().get("user");

        if (sessionUser == null) {
            throw new IllegalArgumentException("Unauthenticated user");
        }

        accessor.setUser((UsernamePasswordAuthenticationToken) sessionUser);
    }
}
