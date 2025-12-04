package com.substring.chat.chat_app_backend.security;

import com.substring.chat.chat_app_backend.entities.User;
import com.substring.chat.chat_app_backend.repository.UserRepository;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
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

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String token = accessor.getFirstNativeHeader("authorization");

            if (token == null || !token.startsWith("Bearer ")) {
                System.out.println("❌ No JWT token in CONNECT headers");
                return message;
            }

            String jwt = token.substring(7);
            String username = jwtUtil.extractUsername(jwt);

            if (username == null) {
                System.out.println("❌ Invalid JWT token");
                return message;
            }

            User user = userRepository.findByUsername(username);
            if (user == null) {
                System.out.println("❌ User not found: " + username);
                return message;
            }

            accessor.setUser(new StompPrincipal(username));

            System.out.println("✔ CONNECT authenticated user: " + username);
        }

        return message;
    }
}
