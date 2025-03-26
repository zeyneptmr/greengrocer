package org.example.greengrocer.controller;

import java.util.Optional;

import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;  // TokenProvider'ı autowire ediyoruz

    // Kullanıcı kaydı
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            // E-posta kontrolü
            if (userRepository.existsByEmail(user.getEmail())) {
                return ResponseEntity.badRequest().body("Bu e-posta zaten kayıtlı.");
            }
            // Kullanıcıyı kaydet
            userRepository.save(user);
            return ResponseEntity.ok("Kayıt başarılı!");
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

            if (existingUserOpt.isPresent() && existingUserOpt.get().getPassword().equals(user.getPassword())) {
                // Token oluşturuluyor
                String token = tokenProvider.generateToken(existingUserOpt.get());
                return ResponseEntity.ok(new LoginResponse(token));  // Token'ı dönüyoruz
            }

            return ResponseEntity.badRequest().body("Geçersiz e-posta veya şifre.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Bir hata oluştu: " + e.getMessage());
        }
    }

    // Token'ı döndüren sınıf (login response)
    public static class LoginResponse {
        private String token;

        public LoginResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }
}