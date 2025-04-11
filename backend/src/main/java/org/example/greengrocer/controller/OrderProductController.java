package org.example.greengrocer.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.example.greengrocer.model.OrderProduct;
import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.OrderProductRepository;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import org.example.greengrocer.model.CustomerOrder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;


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


    /* @GetMapping("/by-order/{orderId}")
    public ResponseEntity<?> getOrderProducts(@PathVariable String orderId, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");


        // Sadece kullanıcının kendi siparişine erişebilmesi için kontrol
        List<OrderProduct> products = orderProductRepository.findByCustomerOrder_OrderId(orderId);
        if (products.isEmpty() || !products.get(0).getCustomerOrder().getUser().getEmail().equals(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        return ResponseEntity.ok(products);
    } */

    @GetMapping("/by-order/{orderId}")
    public ResponseEntity<?> getOrderProducts(@PathVariable String orderId, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        // Sadece kullanıcının kendi siparişine erişebilmesi için kontrol
        List<OrderProduct> products = orderProductRepository.findByCustomerOrder_OrderId(orderId);
        if (products.isEmpty() || !products.get(0).getCustomerOrder().getUser().getEmail().equals(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        System.out.println("Order ID: " + orderId);
        System.out.println("Email from token: " + email);
        System.out.println("Siparişin sahibi email: " + products.get(0).getCustomerOrder().getUser().getEmail());
        System.out.println("OrderProducts size: " + products.size());
        System.out.println("Order user email: " + (products.isEmpty() ? "none" : products.get(0).getCustomerOrder().getUser()));

        // Sadece gerekli alanları içeren bir liste oluşturuyoruz
        List<Map<String, Object>> productData = products.stream().map(product -> {
            Map<String, Object> productInfo = new HashMap<>();
            productInfo.put("productName", product.getProductName());
            productInfo.put("quantity", product.getQuantity());
            productInfo.put("pricePerProduct", product.getPricePerProduct());
            productInfo.put("totalPerProduct", product.getTotalPerProduct());
            productInfo.put("imagePath", product.getImagePath());
            return productInfo;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(productData);
    }




        /*@GetMapping("/by-order/{orderId}")
        public ResponseEntity<?> getOrderProducts(@PathVariable String orderId, HttpServletRequest request) {
            String email = getUserEmailFromToken(request);
            if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

            List<OrderProduct> products = orderProductRepository
                    .findByCustomerOrder_OrderIdAndCustomerOrder_User_Email(orderId, email);

            if (products.isEmpty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            return ResponseEntity.ok(products);
        }*/







    // Belirli bir siparişe ait ürünleri getir
    /*@GetMapping("/by-order/{orderId}")
    public ResponseEntity<?> getOrderProducts(@PathVariable String orderId, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        List<OrderProduct> products = orderProductRepository.findByCustomerOrder_OrderId(orderId);
        return ResponseEntity.ok(products);
    }*/

    // (Opsiyonel) Toplu olarak ürün kaydetmek istersen
    @PostMapping("/save-all")
    public ResponseEntity<?> saveAll(@RequestBody List<OrderProduct> products, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        List<OrderProduct> saved = orderProductRepository.saveAll(products);
        return ResponseEntity.ok(saved);
    }



}
