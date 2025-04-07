package org.example.greengrocer.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.example.greengrocer.model.CartItem;
import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.CartItemRepository;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import org.example.greengrocer.model.Product; // Product sınıfını import et
import org.example.greengrocer.repository.ProductRepository; // ProductRepository'i import et

import java.util.Arrays;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private ProductRepository productRepository;

    private String getUserEmailFromToken(HttpServletRequest request) {
        String token = Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (token == null || !tokenProvider.validateToken(token)) {
            return null;
        }

        return tokenProvider.getEmailFromToken(token);
    }

    // Kullanıcının sepete ürün eklemesi
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestParam Long productId, @RequestParam int quantity, HttpServletRequest request) {
        // Token'ı al
        String email = getUserEmailFromToken(request);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        User user = userOpt.get();

        // Sepette var mı kontrol et
        Optional<CartItem> existingItem = cartItemRepository.findByUserAndProductId(user, productId);
        if (existingItem.isPresent()) {
            // Eğer ürün zaten sepette varsa, miktarı güncelle
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartItemRepository.save(cartItem);
        } else {
            // Yeni ürün ekle
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
            }

            Product product = productOpt.get();

            if (product.getStock() < quantity) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Not enough stock");
            }

            CartItem newCartItem = new CartItem();
            newCartItem.setUser(user);
            newCartItem.setProductId(productId);
            newCartItem.setQuantity(quantity);
            newCartItem.setPrice(product.getPrice());
            newCartItem.setName(product.getProductName());        // EKLENDİ
            newCartItem.setImagePath(product.getImagePath()); // EKLENDİ
            cartItemRepository.save(newCartItem);
        }

        return ResponseEntity.ok("Product with ID " + productId + " added to cart");
    }

    // Kullanıcının sepetindeki ürünleri almak
    @GetMapping
    public ResponseEntity<?> getCart(HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();
        // Sepetteki ürünleri getirelim ve gönderelim
        var cartItems = cartItemRepository.findByUser(user);
        return ResponseEntity.ok(cartItems);
    }

    // Sepet ürününü artırmak
    @PatchMapping("/increase/{id}")
    public ResponseEntity<?> increaseQuantity(@PathVariable Long id, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(id);

        if (cartItemOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found");
        }

        CartItem cartItem = cartItemOpt.get();
        if (!cartItem.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to update this item.");
        }

        cartItem.setQuantity(cartItem.getQuantity() + 1); // Miktarı bir artırıyoruz
        cartItemRepository.save(cartItem);

        return ResponseEntity.ok("Quantity increased for item " + id);
    }

    // Sepet ürününü azaltmak
    @PatchMapping("/decrease/{id}")
    public ResponseEntity<?> decreaseQuantity(@PathVariable Long id, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(id);

        if (cartItemOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found");
        }

        CartItem cartItem = cartItemOpt.get();
        if (!cartItem.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to update this item.");
        }

        if (cartItem.getQuantity() > 1) {
            cartItem.setQuantity(cartItem.getQuantity() - 1); // Miktarı bir azaltıyoruz
            cartItemRepository.save(cartItem);
            return ResponseEntity.ok("Quantity decreased for item " + id);
        } else {
            // Miktar 1 ise, ürünü sepetten sil
            cartItemRepository.delete(cartItem);
            return ResponseEntity.ok("Item removed from cart as quantity is 1");
        }
    }

    // Sepet ürününü silmek
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id, HttpServletRequest request) {
        String email = getUserEmailFromToken(request);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(id);

        if (cartItemOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cart item not found");
        }

        CartItem cartItem = cartItemOpt.get();
        if (!cartItem.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to delete this item.");
        }

        cartItemRepository.delete(cartItem);
        return ResponseEntity.ok("Item removed from cart");
    }
}
