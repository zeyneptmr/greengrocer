package org.example.greengrocer.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.example.greengrocer.model.OrderTotal;
import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.OrderTotalRepository;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.model.CartItem;
import org.example.greengrocer.repository.CartItemRepository;
import org.example.greengrocer.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/ordertotal")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderTotalController {

    @Autowired
    private OrderTotalRepository orderTotalRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

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

    @GetMapping("/getOrderTotal")
    public ResponseEntity<?> getOrderTotal(HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        User user = userOpt.get();
        Optional<OrderTotal> orderTotalOpt = orderTotalRepository.findByUser(user);

        if (orderTotalOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No order totals found for this user.");
        }

        OrderTotal orderTotal = orderTotalOpt.get();
        return ResponseEntity.ok(orderTotal);
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        User user = userOpt.get();
        Optional<OrderTotal> orderTotalOpt = orderTotalRepository.findByUser(user);

        if (orderTotalOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No order total found");

        OrderTotal existingOrderTotal = orderTotalOpt.get();

        OrderTotal newOrder = new OrderTotal();
        newOrder.setUser(user);
        newOrder.setTotalProductCount(existingOrderTotal.getTotalProductCount());
        newOrder.setTotalPrice(existingOrderTotal.getTotalPrice());
        newOrder.setShippingFee(existingOrderTotal.getShippingFee());
        newOrder.setTotalAmount(existingOrderTotal.getTotalAmount());

        orderTotalRepository.save(newOrder);

        orderTotalRepository.delete(existingOrderTotal);

        return ResponseEntity.ok("Checkout completed successfully.");
    }

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
