package org.example.greengrocer.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.example.greengrocer.model.OrderTotal;
import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.OrderTotalRepository;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Optional;

@RestController
@RequestMapping("/api/ordertotal")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderTotalController {

    @Autowired
    private OrderTotalRepository orderTotalRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;

    private String getUserEmailFromToken(HttpServletRequest request) {
        return Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .filter(tokenProvider::validateToken)
                .map(tokenProvider::getEmailFromToken)
                .orElse(null);
    }

    // Kullanıcının sepet toplam verisini getirme
    @GetMapping
    public ResponseEntity<?> getOrderTotal(HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        User user = userOpt.get();
        Optional<OrderTotal> orderTotalOpt = orderTotalRepository.findByUser(user);

        return ResponseEntity.ok(orderTotalOpt.orElse(null));
    }

    // Sepet toplamını güncelleme veya ekleme
    @PostMapping("/update")
    public ResponseEntity<?> updateOrderTotal(@RequestBody OrderTotal incomingData, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        User user = userOpt.get();

        OrderTotal orderTotal = orderTotalRepository.findByUser(user).orElse(new OrderTotal());
        orderTotal.setUser(user);
        orderTotal.setTotalProductCount(incomingData.getTotalProductCount());
        orderTotal.setTotalPrice(incomingData.getTotalPrice());
        orderTotal.setShippingFee(incomingData.getShippingFee());
        orderTotal.setTotalAmount(incomingData.getTotalAmount());

        orderTotalRepository.save(orderTotal);
        return ResponseEntity.ok("Order total saved successfully.");
    }

    // Sepet verilerini sıfırlama (isteğe bağlı)
    @DeleteMapping
    public ResponseEntity<?> clearOrderTotal(HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        User user = userOpt.get();
        orderTotalRepository.deleteByUser(user);
        return ResponseEntity.ok("Order total deleted.");
    }
}
