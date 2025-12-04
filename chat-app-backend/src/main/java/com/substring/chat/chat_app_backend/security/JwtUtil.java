package com.substring.chat.chat_app_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Base64;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final String base64Secret = System.getenv("JWT_SECRET_BASE64");
    private SecretKey signingKey;
    private final long expirationMs = 1000L * 60 * 60 * 4; // 4 hours

    @PostConstruct
    private void init() {
        if (base64Secret == null || base64Secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET_BASE64 environment variable not set");
        }
        byte[] keyBytes = Base64.getDecoder().decode(base64Secret);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate token
    public String generateToken(String username) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(signingKey)
                .compact();
    }

    // VALIDATE token & return username (subject)
    public String validateAndGetSubject(String token) throws JwtException {
        Jws<Claims> parsed = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token);

        return parsed.getBody().getSubject();
    }

    // 🔥 ADD THIS: Equivalent to extractUsername()
    public String extractUsername(String token) {
        return validateAndGetSubject(token);
    }
}
