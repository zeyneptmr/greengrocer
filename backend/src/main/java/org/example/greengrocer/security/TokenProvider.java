package org.example.greengrocer.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.example.greengrocer.model.User;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class TokenProvider {
    // Güvenli, uzun ve karmaşık bir anahtar kullanmalısınız!
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(
        "YourVeryLongAndSecureSecretKeyThatShouldBeAtLeast32CharactersLong"
        .getBytes(StandardCharsets.UTF_8)
    );

    public String generateToken(User user) {
        return Jwts.builder()
            .subject(user.getEmail())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 86400000))  // 1 gün geçerlilik süresi
            .signWith(SECRET_KEY)
            .compact();
    }
}