package org.example.greengrocer.controller;

import org.example.greengrocer.service.MailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.greengrocer.service.RedisService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.example.greengrocer.model.User;
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

    @PostMapping("/sendVerificationCode")
    public ResponseEntity<Map<String, String>> sendVerificationCode(@RequestParam String email) {
        Map<String, String> response = new HashMap<>();

        String verificationCode = mailService.sendVerificationCode(email);

        if (verificationCode == null) {
            response.put("error", "Email not found or failed to send email");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else {
            response.put("message", "Verification code sent to " + email);
            redisService.saveVerificationCodeWithTwoMinutes(email, verificationCode);
            redisService.saveEmail(email);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @PostMapping("/verifyCode")
    public ResponseEntity<Map<String, String>> verifyCode(@RequestParam String email, @RequestParam String code) {
        System.out.println("Received email: " + email);
        System.out.println("Received code: " + code);
        Map<String, String> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);

        if (userOpt.isEmpty()) {
            response.put("error", "Email not found. Provided Email: " + email);
            System.out.println("Email not found. Provided Email: " + email);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        System.out.println("Email: " + email + ", Code: " + code);

        String serverVerificationCode = redisService.getVerificationCode(email);

        System.out.println("Retrieved verification code: " + serverVerificationCode);

        if (serverVerificationCode == null) {
            response.put("error", "Verification code has expired or does not exist.");
            System.out.println("Verification code for " + email + " has expired or does not exist.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        System.out.println("Server Code: " + serverVerificationCode + ", Provided Code: " + code);

        if (serverVerificationCode.equals(code)) {
            response.put("message", "Code verified successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {

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

        if (redisEmail == null) {
            response.put("error", "Email not found or expired in Redis.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(redisEmail);
        if (userOpt.isEmpty()) {
            System.out.println("User not found for email: " + redisEmail);
            response.put("error", "User not found.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        System.out.println("Encoded password: " + user.getPassword());

        userRepository.save(user);
        System.out.println("User password updated successfully.");

        redisService.deleteEmailVerificationCode(redisEmail);
        System.out.println("Verification code deleted from Redis for email: " + redisEmail);

        response.put("message", "Password reset successfully.");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}