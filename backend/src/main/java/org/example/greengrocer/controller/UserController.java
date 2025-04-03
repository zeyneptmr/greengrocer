package org.example.greengrocer.controller;

import java.util.Optional;

import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // CORS yapılandırması (Frontend'in çalıştığı port)
public class UserController {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;  // BCrypt için

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;  // TokenProvider'ı autowire ediyoruz

    // Kullanıcı kaydı
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            // E-posta kontrolü
            if (userRepository.existsByEmail(user.getEmail())) {
                return ResponseEntity.badRequest().body("This email is already registered.");
            }

            // Manager ve Admin kontrolü, eğer veritabanında yoksa, belirli e-posta adreslerine özel roller verilecek
            if (!userRepository.existsByRole("ADMIN") && user.getEmail().equals("admin@taptaze.com")) {
                user.setRole("ADMIN");
            } else if (!userRepository.existsByRole("MANAGER") && user.getEmail().equals("manager@taptaze.com")) {
                user.setRole("MANAGER");
            } else {
                // Admin veya Manager'dan başka bir kullanıcı kaydediliyorsa, sadece "USER" rolü verilecek
                user.setRole("USER");
            }

            // Şifreyi hash'leyerek kaydet
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            // Kullanıcıyı kaydet
            userRepository.save(user);
            return ResponseEntity.ok("Registration successful!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Bir hata oluştu: " + e.getMessage());
        }
    }

    // Kullanıcı girişi
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            // Optional kullanıyoruz
            Optional<User> existingUserOpt = userRepository.findByEmail(user.getEmail());

            if (existingUserOpt.isPresent() &&
                    passwordEncoder.matches(user.getPassword(), existingUserOpt.get().getPassword())) {

                User authenticatedUser = existingUserOpt.get();
                String role = authenticatedUser.getRole();

                // Token oluşturuluyor, email ve rol bilgisi ile
                String token = tokenProvider.generateToken(authenticatedUser.getEmail(), role);

                // LoginResponse döndürüyoruz
                LoginResponse response = new LoginResponse(token, role);
                return ResponseEntity.ok(response);  // Token ve rolü döndürüyoruz
            }

            return ResponseEntity.badRequest().body("Geçersiz e-posta veya şifre.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Bir hata oluştu: " + e.getMessage());
        }
    }

    // Token'ı döndüren sınıf (login response)
    public static class LoginResponse {
        private String token;
        private String role; // Yeni eklenen alan

        public LoginResponse(String token, String role) {
            this.token = token;
            this.role = role;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }
} 