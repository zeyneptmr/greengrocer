package org.example.greengrocer.controller;

import org.example.greengrocer.service.MailService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.example.greengrocer.service.RedisService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.example.greengrocer.model.User; // Kullanıcı sınıfının bulunduğu paketi belirleyin
import org.example.greengrocer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@RestController
@RequestMapping("/api/mail")
public class MailController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private final MailService mailService;

    public MailController(MailService mailService) {
        this.mailService = mailService;
    }

    @Autowired
    private RedisService redisService;

    // Doğrulama kodu gönderme
    @PostMapping("/sendVerificationCode")
    public ResponseEntity<Map<String, String>> sendVerificationCode(@RequestParam String email) {
        Map<String, String> response = new HashMap<>();

        // Doğrulama kodu gönderme işlemi
        String verificationCode = mailService.sendVerificationCode(email);

        if (verificationCode == null) {
            response.put("error", "Email not found or failed to send email");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);  // Hata durumunda 400 döndür
        } else {
            response.put("message", "Verification code sent to " + email);
            // Doğrulama kodunu Redis'e kaydet
            redisService.saveVerificationCodeWithTwoMinutes(email, verificationCode);
            redisService.saveEmail(email);
            return new ResponseEntity<>(response, HttpStatus.OK);  // Başarı durumunda 200 döndür
        }
    }

    // Doğrulama kodunu kontrol etme
    @PostMapping("/verifyCode")
    public ResponseEntity<Map<String, String>> verifyCode(@RequestParam String email, @RequestParam String code) {
        System.out.println("Received email: " + email);
        System.out.println("Received code: " + code);
        Map<String, String> response = new HashMap<>();

        // E-posta ve doğrulama  kodunu kontrol etme (serverCode ve email karşılaştırma işlemi ekleyin)
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isEmpty()) {
            response.put("error", "Email not found. Provided Email: " + email);
            System.out.println("Email not found. Provided Email: " + email);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        System.out.println("Email: " + email + ", Code: " + code);


        // Kod doğrulama işlemi burada yapılabilir
        String serverVerificationCode = redisService.getVerificationCode(email);

        System.out.println("Retrieved verification code: " + serverVerificationCode);
        // Kod süresinin dolup dolmadığını kontrol etme
        if (serverVerificationCode == null) {
            response.put("error", "Verification code has expired or does not exist.");
            System.out.println("Verification code for " + email + " has expired or does not exist.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Kod doğrulama işlemi burada yapılabilir
        System.out.println("Server Code: " + serverVerificationCode + ", Provided Code: " + code);

        if (serverVerificationCode.equals(code)) {
            response.put("message", "Code verified successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            // Eğer kodlar eşleşmezse, hata mesajını logla
            response.put("error", "Invalid verification code.");
            System.out.println("Invalid code provided: " + code + ", Expected: " + serverVerificationCode);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestParam String newPassword) {
        Map<String, String> response = new HashMap<>();

        String redisEmail = redisService.getEmail();
        System.out.println("Retrieved email from Redis: " + redisEmail);

        // if koşulunu doğru şekilde yazıyoruz
        if (redisEmail == null) {
            response.put("error", "Email not found or expired in Redis.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Kullanıcıyı veritabanında bul
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(redisEmail);
        if (userOpt.isEmpty()) {
            System.out.println("User not found for email: " + redisEmail);
            response.put("error", "User not found.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Yeni şifreyi hash'le ve kaydet
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));  // Hash'lenmiş şifreyi kaydediyoruz
        System.out.println("Encoded password: " + user.getPassword());

        userRepository.save(user);
        System.out.println("User password updated successfully.");

        redisService.deleteEmailVerificationCode(redisEmail);
        System.out.println("Verification code deleted from Redis for email: " + redisEmail);

        response.put("message", "Password reset successfully.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}