package org.example.greengrocer.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.example.greengrocer.model.User;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class TokenProvider {

    private static final String SECRET_KEY = "secret_key";  // Güvenli bir anahtar kullanmalısınız!

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))  // 1 gün geçerlilik süresi
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }
}
