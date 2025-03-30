package org.example.greengrocer.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final TokenProvider tokenProvider; // TokenProvider'ı buraya ekliyoruz

    // JwtAuthenticationFilter constructor'ına TokenProvider ekliyoruz
    public JwtAuthenticationFilter(UserRepository userRepository, TokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = getTokenFromRequest(request);
        if (token != null && tokenProvider.validateToken(token)) { // validateToken'ı TokenProvider'dan çağırıyoruz
            String email = tokenProvider.getEmailFromToken(token); // TokenProvider ile email alıyoruz

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı: " + email));

            String role = user.getRole();  // Burada role bilgisi alınıyor

            // Kullanıcının rolünü al
            List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));

            // SecurityContext'e ekle
            JwtAuthentication authentication = new JwtAuthentication(email, role, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);  // "Bearer " kısmını kaldırıyoruz
        }
        return null;
    }
}