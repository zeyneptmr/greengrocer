package org.example.greengrocer.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.example.greengrocer.model.User;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class TokenProvider {

    // Güvenli bir 512-bit anahtar oluşturuluyor
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);  // HS512 için 512-bit anahtar

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))  // 1 gün geçerlilik süresi
                .signWith(SECRET_KEY)  // Şimdi 512-bit anahtar ile imzalanıyor
                .compact();
    }
}
