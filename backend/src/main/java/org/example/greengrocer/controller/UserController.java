package org.example.greengrocer.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.example.greengrocer.model.CustomerOrder;
import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.AddressRepository;
import org.example.greengrocer.repository.CardRepository;
import org.example.greengrocer.repository.CustomerOrderRepository;
import org.example.greengrocer.repository.OrderProductRepository;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.security.TokenProvider;
import org.example.greengrocer.repository.OrderTotalRepository;
import org.example.greengrocer.repository.CartItemRepository;
import org.example.greengrocer.repository.FavoriteRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // CORS yapılandırması (Frontend'in çalıştığı port)
public class UserController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;


    @Autowired
    private OrderTotalRepository orderTotalRepository;


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
    public ResponseEntity<?> login(@RequestBody User user, HttpServletResponse response) {
        try {
            // Optional kullanıyoruz
            Optional<User> existingUserOpt = userRepository.findByEmail(user.getEmail());

            if (existingUserOpt.isPresent() &&
                    passwordEncoder.matches(user.getPassword(), existingUserOpt.get().getPassword())) {

                User authenticatedUser = existingUserOpt.get();
                String role = authenticatedUser.getRole();

                // Token oluşturuluyor, email ve rol bilgisi ile
                String token = tokenProvider.generateToken(authenticatedUser.getEmail(), role);

                // Cookie oluştur
                Cookie cookie = new Cookie("token", token);
                cookie.setHttpOnly(true);
                cookie.setSecure(false);
                cookie.setPath("/");
                cookie.setMaxAge(86400); // 1 gün (saniye cinsinden)

                // Çerezi yanıta ekle
                response.addCookie(cookie);

                //  Alternatif olarak Header'dan da çerez ekleyebilirim, csrf saldıırlarına karşı güvenli
                //response.setHeader("Set-Cookie", "token=" + token + "; Path=/; Secure; HttpOnly; SameSite=Strict");

                // LoginResponse döndürüyoruz
                LoginResponse loginresponse = new LoginResponse("Login successful!", role);
                return ResponseEntity.ok(loginresponse);  // Token ve rolü döndürüyoruz
            }

            return ResponseEntity.badRequest().body("Geçersiz e-posta veya şifre.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Bir hata oluştu: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getAuthenticatedUser(HttpServletRequest request) {
        // Çerezi alın
        String token = Arrays.stream(request.getCookies())
                .filter(cookie -> "token".equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (token != null && tokenProvider.validateToken(token)) {
            // Token geçerli, kullanıcıyı doğrulama işlemi
            String username = tokenProvider.getEmailFromToken(token);
            Optional<User> userOpt = userRepository.findByEmail(username);

            if (userOpt.isPresent()) {
                return ResponseEntity.ok(userOpt.get());  // Kullanıcı bilgisi
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token.");
        }
    }

    @GetMapping("/count/users")
    public ResponseEntity<Long> getUserCount() {
        try {
            long userCount = userRepository.countByRole("USER");
            return ResponseEntity.ok(userCount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0L);  // Return 0 if there's an error
        }
    }


    // Token'ı döndüren sınıf (login response)
    public static class LoginResponse {
        private String token;
        private String role;

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

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        try {
            // Token'ı iptal etmek için çerezi sıfırlıyoruz
            Cookie cookie = new Cookie("token", null);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // HTTPS kullanıyorsanız true yapmalısınız
            cookie.setPath("/");
            cookie.setMaxAge(0); // Çerez süresini 0 yaparak silinmesini sağlıyoruz
            response.addCookie(cookie);

            // Çıkış işlemi başarılı, mesaj dönüyoruz
            return ResponseEntity.ok("Logout successful!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Logout failed: " + e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUserInfo(@RequestBody User updatedUser, HttpServletRequest request) {
        try {

            Cookie[] cookies = request.getCookies();
            if (cookies == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authentication token found.");
            }

            String token = Arrays.stream(cookies)
                    .filter(cookie -> "token".equals(cookie.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);

            if (token == null || !tokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token.");
            }

            String email = tokenProvider.getEmailFromToken(token);

            Optional<User> existingUserOpt = userRepository.findByEmail(email);
            if (!existingUserOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            User existingUser = existingUserOpt.get();


            existingUser.setName(updatedUser.getName());
            existingUser.setSurname(updatedUser.getSurname());
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());


            userRepository.save(existingUser);

            existingUser.setPassword(null);

            return ResponseEntity.ok(existingUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }


    public static class PasswordChangeRequest {
        private String currentPassword;
        private String newPassword;
        private String confirmPassword;


        public String getCurrentPassword() {
            return currentPassword;
        }

        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }

        public String getConfirmPassword() {
            return confirmPassword;
        }

        public void setConfirmPassword(String confirmPassword) {
            this.confirmPassword = confirmPassword;
        }
    }


    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest passwordRequest, HttpServletRequest request) {
        try {
            // Get token from cookies or Authorization header (handled by getTokenFromRequest in JwtAuthenticationFilter)
            String token = null;
            if (request.getCookies() != null) {
                token = Arrays.stream(request.getCookies())
                        .filter(cookie -> "token".equals(cookie.getName()))
                        .findFirst()
                        .map(Cookie::getValue)
                        .orElse(null);
            }

            if (token == null || !tokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token.");
            }

            String email = tokenProvider.getEmailFromToken(token);
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            User user = userOpt.get();


            if (!passwordEncoder.matches(passwordRequest.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Current password is incorrect.");
            }


            if (passwordRequest.getNewPassword().length() < 8) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must be at least 8 characters long.");
            }

            if (passwordRequest.getNewPassword().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password cannot be empty.");
            }

            if (!passwordRequest.getNewPassword().equals(passwordRequest.getConfirmPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New passwords do not match.");
            }


            if (passwordEncoder.matches(passwordRequest.getNewPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password cannot be the same as current password.");
            }


            user.setPassword(passwordEncoder.encode(passwordRequest.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok("Password changed successfully!");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }




    public static class DeleteAccountRequest {
        private String password;

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }


    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CardRepository cardRepository;


    @Autowired
    private CustomerOrderRepository customerOrderRepository;


    @Autowired
    private OrderProductRepository orderProductRepository;

    @PostMapping("/delete-account")
    @Transactional
    public ResponseEntity<?> deleteAccount(@RequestBody DeleteAccountRequest deleteRequest, HttpServletRequest request, HttpServletResponse response) {
        try {

            String token = null;
            if (request.getCookies() != null) {
                token = Arrays.stream(request.getCookies())
                        .filter(cookie -> "token".equals(cookie.getName()))
                        .findFirst()
                        .map(Cookie::getValue)
                        .orElse(null);
            }

            if (token == null || !tokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token.");
            }

            String email = tokenProvider.getEmailFromToken(token);
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            User user = userOpt.get();


            if (!passwordEncoder.matches(deleteRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect password.");
            }


            // First find all orders for this user
            List<CustomerOrder> userOrders = customerOrderRepository.findByUserId(user.getId());

            cartItemRepository.deleteAllByUserId(user.getId());

            favoriteRepository.deleteAllByUserId(user.getId());

            orderTotalRepository.deleteByUser(user);


            // Delete order products for each order
            for (CustomerOrder order : userOrders) {
                orderProductRepository.deleteAllByCustomerOrder(order);
            }

            customerOrderRepository.deleteAllByUserId(user.getId());
            addressRepository.deleteAllByUserId(user.getId());
            cardRepository.deleteAllByUserId(user.getId());
            userRepository.delete(user);


            Cookie cookie = new Cookie("token", null);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(0);
            response.addCookie(cookie);

            return ResponseEntity.ok("Account deleted successfully.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }



}