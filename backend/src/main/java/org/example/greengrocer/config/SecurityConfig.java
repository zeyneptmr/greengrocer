package org.example.greengrocer.config;

import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserRepository userRepository;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, UserRepository userRepository) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userRepository = userRepository;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> userRepository.findByEmail(email)
                .map(user -> (User) user)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/index.html").permitAll()
                .requestMatchers("/api/users/login", "/api/users/register").permitAll()
                    .requestMatchers("/api/mail/sendVerificationCode", "/api/mail/verifyCode").permitAll()
                    .requestMatchers("/api/mail/resetPassword").permitAll()
                    .requestMatchers("/api/contact/**").permitAll()
                    .requestMatchers("/api/users/me").permitAll()
                    .requestMatchers("/api/products/**").permitAll()
                    .requestMatchers("/api/users/**").permitAll()
                    .requestMatchers("/update-price").permitAll()
                    .requestMatchers("/api/discountedProducts/**").permitAll()
                    .requestMatchers("/api/cards/**").permitAll()
                    .requestMatchers("/api/addresses/**").permitAll()
                    .requestMatchers("/api/cart/**").permitAll()
                    .requestMatchers("/api/users**").permitAll()
                    .requestMatchers("/logout").permitAll()
                    .requestMatchers("/api/favorites/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}