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

    // Expect the JWT secret as a Base64-encoded string in env var JWT_SECRET_BASE64
    // e.g. export JWT_SECRET_BASE64="$(openssl rand -base64 32)"
    private final String base64Secret = System.getenv("JWT_SECRET_BASE64");

    // SecretKey instance used for signing & verification
    private SecretKey signingKey;

    // token validity (ms)
    private final long expirationMs = 1000L * 60 * 60 * 4; // 4 hours

    @PostConstruct
    private void init() {
        if (base64Secret == null || base64Secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET_BASE64 environment variable not set");
        }
        byte[] keyBytes = Base64.getDecoder().decode(base64Secret);
        // Keys.hmacShaKeyFor will validate length and construct an HMAC key
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(signingKey) // non-deprecated Key-based API
                .compact();
    }

    public String validateAndGetSubject(String token) throws JwtException {
        // parseClaimsJws verifies signature and expiration
        Jws<Claims> parsed = Jwts.parserBuilder()
                .setSigningKey(signingKey)   // use the Key
                .build()
                .parseClaimsJws(token);
        return parsed.getBody().getSubject();
    }
}
