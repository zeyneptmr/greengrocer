package org.example.greengrocer.security;

<<<<<<< HEAD
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
=======
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
>>>>>>> 07b3b716a8401d77abaf818fb575916bee38aa37
    }
}