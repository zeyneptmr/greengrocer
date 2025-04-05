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
    
    // Secret Key ve Expiration süresini application.propertcies dosyasından alıyoruz
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
                .subject(email)  // JJWT 0.12.x ile bu şekilde kullanılır
                .claim("role", role)  // Role bilgisini claim olarak ekliyoruz
                .issuedAt(new Date())  // JJWT 0.12.x ile bu şekilde kullanılır
                .expiration(new Date(System.currentTimeMillis() + expirationMs))  // JJWT 0.12.x ile bu şekilde kullanılır
                .signWith(secretKey)
                .compact();
    }
    
    public String getEmailFromToken(String token) {
        // JJWT 0.12.x ile token çözümleme
        return Jwts.parser()
                .verifyWith(secretKey)  // setSigningKey yerine verifyWith kullanılır
                .build()
                .parseSignedClaims(token)  // parseClaimsJws yerine parseSignedClaims kullanılır
                .getPayload()  // getBody yerine getPayload kullanılır
                .getSubject();
    }
    
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)  // setSigningKey yerine verifyWith kullanılır
                .build()
                .parseSignedClaims(token)  // parseClaimsJws yerine parseSignedClaims kullanılır
                .getPayload();  // getBody yerine getPayload kullanılır
        String role = claims.get("role", String.class);  // "role" claim'inden rol bilgisini alıyoruz
        if (role == null) {
            throw new IllegalArgumentException("Role bilgisi bulunamadı");
        }
        return role;
    }
    
    public boolean validateToken(String token) {
        try {
            // JJWT 0.12.x ile token'ı doğrulama
            Jwts.parser()
                .verifyWith(secretKey)  // setSigningKey yerine verifyWith kullanılır
                .build()
                .parseSignedClaims(token);  // parseClaimsJws yerine parseSignedClaims kullanılır
            return true;
        } catch (Exception e) {
            return false;  // Hata alırsak geçersiz olarak kabul ediyoruz
        }
    }
}