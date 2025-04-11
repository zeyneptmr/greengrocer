package org.example.greengrocer.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.example.greengrocer.model.OrderProduct;
import org.example.greengrocer.model.Product;
import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.OrderProductRepository;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.security.TokenProvider;
import org.example.greengrocer.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/orderproduct")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderProductController {

    @Autowired
    private OrderProductRepository orderProductRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;

    // Token'dan email çekme fonksiyonu
    private String getUserEmailFromToken(HttpServletRequest request) {
        return Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .map(Cookie::getValue)
                .filter(token -> tokenProvider.validateToken(token))
                .map(tokenProvider::getEmailFromToken)
                .findFirst().orElse(null);
    }

    // Belirli bir siparişe ait ürünleri getir
    @GetMapping("/by-order/{orderId}")
    public ResponseEntity<?> getOrderProducts(@PathVariable String orderId, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        List<OrderProduct> products = orderProductRepository.findByCustomerOrder_OrderId(orderId);
        return ResponseEntity.ok(products);
    }

    // (Opsiyonel) Toplu olarak ürün kaydetmek istersen
    @PostMapping("/save-all")
    public ResponseEntity<?> saveAll(@RequestBody List<OrderProduct> products, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        List<OrderProduct> saved = orderProductRepository.saveAll(products);
        return ResponseEntity.ok(saved);
    }


    @Autowired
    private ProductService productService;

    @PostMapping("/process-order/{orderId}")
    public ResponseEntity<?> processOrderAndUpdateStock(@PathVariable String orderId, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        // Get all OrderProduct records for this order
        List<OrderProduct> orderProducts = orderProductRepository.findByCustomerOrder_OrderId(orderId);
        
        if (orderProducts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No products found in this order");
        }
        System.out.println("Found " + orderProducts.size() + " products in order");
        
        // Process each product and update stock
        for (OrderProduct orderProduct : orderProducts) {
            Long productId = orderProduct.getProductId();
            int quantity = orderProduct.getQuantity();

            System.out.println("OrderProduct details - ID: " + orderProduct.getProductId() + 
                          ", Product ID: " + productId + 
                          ", Name: " + orderProduct.getProductName() + 
                          ", Quantity: " + quantity);
            // Update stock in product table
            Product updatedProduct = productService.decreaseProductStock(productId, quantity);
            
            if (updatedProduct == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Product with ID " + productId + " not found");
            }
        }
        
        return ResponseEntity.ok("Stock updated successfully for order: " + orderId);
    }
        







}
