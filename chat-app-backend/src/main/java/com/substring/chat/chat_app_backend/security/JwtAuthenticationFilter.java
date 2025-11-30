package com.substring.chat.chat_app_backend.security;


import com.substring.chat.chat_app_backend.repository.UserRepository; // adjust this import to your package
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7); // remove "Bearer "

            try {
                // ⛔ No deprecated parsing anymore — uses JwtUtil's modern parser
                String username = jwtUtil.validateAndGetSubject(token);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                    // Check if user exists in DB
                    var user = userRepository.findByUsername(username);
                    if (user != null) {
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        username,
                                        null,
                                        List.of() // add roles if needed
                                );

                        // ⬅️ set authentication inside security context
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }

            } catch (io.jsonwebtoken.ExpiredJwtException ex) {
                // Token expired
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            } catch (io.jsonwebtoken.JwtException ex) {
                // Invalid token (signature, malformed, unsupported)
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
