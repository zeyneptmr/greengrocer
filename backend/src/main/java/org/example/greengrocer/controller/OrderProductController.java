package org.example.greengrocer.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.example.greengrocer.repository.ProductRepository;
import org.example.greengrocer.model.OrderProduct;
import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.CustomerOrderRepository;
import org.example.greengrocer.repository.OrderProductRepository;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.example.greengrocer.model.ProductTranslation;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.example.greengrocer.model.Product;
import org.example.greengrocer.service.ProductService;

@RestController
@RequestMapping("/api/orderproduct")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderProductController {
    
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderProductRepository orderProductRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;
    
    @Autowired
    private ProductService productService;

    private String getUserEmailFromToken(HttpServletRequest request) {
        return Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .map(Cookie::getValue)
                .filter(token -> tokenProvider.validateToken(token))
                .map(tokenProvider::getEmailFromToken)
                .findFirst().orElse(null);
    }

    private boolean isUserManagerOrAdmin(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;
        
        User user = userOpt.get();
       
        return user.getRole() != null && (user.getRole().equals("ADMIN") || user.getRole().equals("MANAGER"));
    }


    @GetMapping("/by-order/{orderId}")
    public ResponseEntity<?> getOrderProducts(@PathVariable String orderId, HttpServletRequest request, @RequestParam(required = false) String language) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        List<OrderProduct> products = orderProductRepository.findByCustomerOrder_OrderId(orderId);
        if (products.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No products found for this order");
        }

         boolean isOwner = products.get(0).getCustomerOrder().getUser().getEmail().equals(email);
         boolean isManager = isUserManagerOrAdmin(email);
         
         if (!isOwner && !isManager) {
             return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
         }

        List<Map<String, Object>> productData = products.stream().map(product -> {
            Map<String, Object> productInfo = new HashMap<>();
            productInfo.put("productName", product.getProductName());
            productInfo.put("quantity", product.getQuantity());
            productInfo.put("pricePerProduct", product.getPricePerProduct());
            productInfo.put("totalPerProduct", product.getTotalPerProduct());
            productInfo.put("imagePath", product.getImagePath());

            if (product.getProductId() != null && language != null) {
                Optional<Product> realProductOpt = productRepository.findById(product.getProductId());
                if (realProductOpt.isPresent()) {
                    Product realProduct = realProductOpt.get();

                    String translatedName = realProduct.getProductTranslations().stream()
                            .filter(tr -> tr.getLanguage().equalsIgnoreCase(language))
                            .findFirst()
                            .map(ProductTranslation::getTranslatedName)
                            .orElse(product.getProductName());

                    productInfo.put("translatedName", translatedName);
                }
            }

            return productInfo;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(productData);
    }

    @PostMapping("/save-all")
    public ResponseEntity<?> saveAll(@RequestBody List<OrderProduct> products, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        List<OrderProduct> saved = orderProductRepository.saveAll(products);
        return ResponseEntity.ok(saved);
    }


    @PostMapping("/process-order/{orderId}")
    public ResponseEntity<?> processOrderAndUpdateStock(@PathVariable String orderId, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");

        List<OrderProduct> orderProducts = orderProductRepository.findByCustomerOrder_OrderId(orderId);

        if (orderProducts.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No products found in this order");
        }
        System.out.println("Found " + orderProducts.size() + " products in order");

        for (OrderProduct orderProduct : orderProducts) {
            Long productId = orderProduct.getProductId();
            int quantity = orderProduct.getQuantity();

            System.out.println("OrderProduct details - ID: " + orderProduct.getProductId() +
                    ", Product ID: " + productId +
                    ", Name: " + orderProduct.getProductName() +
                    ", Quantity: " + quantity);

            Product updatedProduct = productService.decreaseProductStock(productId, quantity);

            if (updatedProduct == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Product with ID " + productId + " not found");
            }
        }

        return ResponseEntity.ok("Stock updated successfully for order: " + orderId);
    }

}
