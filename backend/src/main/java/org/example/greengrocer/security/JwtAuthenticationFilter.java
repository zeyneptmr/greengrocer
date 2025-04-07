package org.example.greengrocer.security;

import java.io.IOException;
import java.util.List;

import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final TokenProvider tokenProvider;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(TokenProvider tokenProvider, UserRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Check if the request is for the '/api/contact/submit' endpoint, and skip the JWT authentication if true
        String requestURI = request.getRequestURI();
        if (requestURI.equals("/api/contact/submit")) {
            filterChain.doFilter(request, response); // Skip JWT authentication for this endpoint
            return;
        }

        String token = getTokenFromRequest(request);

        try {
            if (token != null && tokenProvider.validateToken(token)) {
                String email = tokenProvider.getEmailFromToken(token);


                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + email));

                String role = user.getRole();
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));


                JwtAuthentication authentication = new JwtAuthentication(email, role, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        // 1. Cookie içinden al
        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        // 2. (Opsiyonel) Authorization header'dan da destekle
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        return null;
    }

}