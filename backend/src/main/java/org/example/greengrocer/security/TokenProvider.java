package org.example.greengrocer.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class TokenProvider {

    private final SecretKey secretKey;
    private final long expirationMs;

    // Secret Key ve Expiration süresini application.properties dosyasından alıyoruz
    public TokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expirationMs}") long expirationMs
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(String email, String role) {
        if (role == null) {
            throw new IllegalArgumentException("Role bilgisi boş olamaz");
        }
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)  // Role bilgisini claim olarak ekliyoruz
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))  // 1 gün geçerlilik süresi
                .signWith(secretKey)
                .compact();
    }

    public String getEmailFromToken(String token) {
        // `Jwts.parser()` kullanarak eski yöntemle JWT çözümleme
        return Jwts.parser()  // Eski parser() yöntemi
                .setSigningKey(secretKey)
                .parseClaimsJws(token)  // Token'ı çözümleyip claim'leri alıyoruz
                .getBody()
                .getSubject();
    }

    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()  // Eski parser() yöntemi ile JWT'yi çözümleme
                .setSigningKey(secretKey)
                .parseClaimsJws(token)  // Token'ı çözümleyip claim'leri alıyoruz
                .getBody();
        String role = claims.get("role", String.class);  // "role" claim'inden rol bilgisini alıyoruz
        if (role == null) {
            throw new IllegalArgumentException("Role bilgisi bulunamadı");
        }
        return role;
    }

    public boolean validateToken(String token) {
        try {
            // Eski parser() yöntemi ile token'ı doğrulama
            Jwts.parser()  // Eski parser() yöntemi
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token);  // Token'ı doğruluyoruz
            return true;
        } catch (Exception e) {
            return false;  // Hata alırsak geçersiz olarak kabul ediyoruz
        }
    }
}