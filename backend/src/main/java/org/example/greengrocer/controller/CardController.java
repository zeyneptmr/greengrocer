package org.example.greengrocer.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.example.greengrocer.model.Card;
import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.CardRepository;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import org.example.greengrocer.security.EncryptionUtils;

import java.util.Arrays;
import java.util.Optional;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:3000")
public class CardController {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;


    @GetMapping
    public ResponseEntity<?> getSavedCards(HttpServletRequest request) {
        // Token'ı al
        String token = Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        // Token doğrulaması
        if (token == null || !tokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        // Token'dan email'i al
        String email = tokenProvider.getEmailFromToken(token);
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Kullanıcıya ait kartları getir
        User user = userOpt.get();
        List<Card> savedCards = cardRepository.findByUser(user);

        // Kartlar yoksa
        if (savedCards.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No saved cards found");
        }

        // Kartları döndür
        return ResponseEntity.ok(savedCards);
    }

    @PostMapping
    public ResponseEntity<?> saveCard(@RequestBody Card incomingCard, HttpServletRequest request) {
        String token = Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (token == null || !tokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String email = tokenProvider.getEmailFromToken(token);
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // Kart numarasının sadece son 4 hanesini al
        String cardNumberLast4 = incomingCard.getCardNumberLast4();

        System.out.println("Received card number (last 4 digits): " + cardNumberLast4);

        if (cardNumberLast4 == null || cardNumberLast4.length() != 4) {
            return ResponseEntity.badRequest().body("Invalid card number. It must be 4 digits.");
        }

        List<Card> existingCards = cardRepository.findByUser(userOpt.get());
        Boolean isFirstCard = existingCards.isEmpty();

        //String encryptedCVV = EncryptionUtils.encrypt(incomingCard.getCvvEncrypted());

        // Kart objesini oluştur ve kaydet
        Card cardToSave = new Card();
        cardToSave.setCardNumberLast4(cardNumberLast4);  // Son 4 haneyi kaydediyoruz
        cardToSave.setHolderName(incomingCard.getHolderName());
        cardToSave.setExpiryMonth(incomingCard.getExpiryMonth());
        cardToSave.setExpiryYear(incomingCard.getExpiryYear());
        cardToSave.setUser(userOpt.get());
        cardToSave.setIsDefault(isFirstCard);

        //cardToSave.setCvvEncrypted(encryptedCVV);

        cardRepository.save(cardToSave);
        return ResponseEntity.ok("Card saved (only last 4 digits stored)");
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCard(@PathVariable Long id, HttpServletRequest request) {
        String token = Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (token == null || !tokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String email = tokenProvider.getEmailFromToken(token);
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        Optional<Card> cardOpt = cardRepository.findById(id);
        if (cardOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Card not found");
        }

        Card card = cardOpt.get();
        // Sadece kullanıcının kendi kartını silmesine izin ver
        if (!card.getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to delete this card.");
        }

        cardRepository.deleteById(id);
        return ResponseEntity.ok("Card deleted successfully.");
    }

    @PutMapping("/default")
    public ResponseEntity<?> setDefaultCard(@RequestBody Card incomingCard, HttpServletRequest request) {
        String token = Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (token == null || !tokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String email = tokenProvider.getEmailFromToken(token);
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        Long cardId = incomingCard.getId();
        Optional<Card> selectedCardOpt = cardRepository.findById(cardId);

        if (selectedCardOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Card not found");
        }

        Card selectedCard = selectedCardOpt.get();

        // Kullanıcının kartı mı kontrolü
        if (!selectedCard.getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to update this card.");
        }

        // Önce tüm kartları varsayılan değil yap
        List<Card> userCards = cardRepository.findByUser(userOpt.get());
        for (Card card : userCards) {
            card.setIsDefault(false);
        }

        // Seçilen kartı varsayılan yap
        selectedCard.setIsDefault(true);

        // Tüm kartları kaydet
        cardRepository.saveAll(userCards);

        return ResponseEntity.ok("Default card set successfully.");
    }


}
