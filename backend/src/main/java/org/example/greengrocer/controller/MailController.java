package org.example.greengrocer.controller;

import org.example.greengrocer.service.MailService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/mail")
public class MailController {

    private final MailService mailService;

    public MailController(MailService mailService) {
        this.mailService = mailService;
    }

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
            return new ResponseEntity<>(response, HttpStatus.OK);  // Başarı durumunda 200 döndür
        }
    }

    // Doğrulama kodunu kontrol etme
    @PostMapping("/verifyCode")
    public ResponseEntity<Map<String, String>> verifyCode(@RequestParam String email, @RequestParam String code) {
        Map<String, String> response = new HashMap<>();

        // Burada e-posta ve kodu doğrulama işlemi yapılabilir
        // Kodun doğruluğunu kontrol ediyorsanız, burada kodu doğrulamak için bir mantık ekleyebilirsiniz

        response.put("message", "Code verified successfully.");
        return new ResponseEntity<>(response, HttpStatus.OK);  // Başarı durumunda 200 döndür
    }
}
