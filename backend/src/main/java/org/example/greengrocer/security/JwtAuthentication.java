package org.example.greengrocer.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;

public class JwtAuthentication extends AbstractAuthenticationToken {

    private final String email;

    public JwtAuthentication(String email) {
        super(null);  // Yetkilendirilmiş kullanıcı bilgileri
        this.email = email;
        setAuthenticated(true);
    }

    public String getEmail() {
        return email;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return email;
    }
}