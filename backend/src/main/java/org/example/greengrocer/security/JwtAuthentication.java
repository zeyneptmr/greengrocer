package org.example.greengrocer.security;

import java.util.List;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class JwtAuthentication extends AbstractAuthenticationToken {

    private final String email;
    private final String role;

    public JwtAuthentication(String email, String role, List<SimpleGrantedAuthority> authorities) {
        super(authorities);
        this.email = email;
        this.role = role;
        setAuthenticated(true);
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
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