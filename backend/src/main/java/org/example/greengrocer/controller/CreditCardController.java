package org.example.greengrocer.controller;

import java.util.List;

import org.example.greengrocer.model.CreditCard;
import org.example.greengrocer.security.TokenProvider;
import org.example.greengrocer.service.CreditCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cards")
public class CreditCardController {

    @Autowired
    private CreditCardService creditCardService;

    @Autowired
    private TokenProvider tokenProvider;

    @PostMapping
    public ResponseEntity<CreditCard> addCard(@RequestHeader("Authorization") String token,
                                              @RequestBody CreditCard card) {
        String email = tokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        CreditCard saved = creditCardService.saveCard(email, card);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<CreditCard>> getUserCards(@RequestHeader("Authorization") String token) {
        String email = tokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(creditCardService.getUserCards(email));
    }
}
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteCard(@PathVariable Long id) {
    try {
        Map<String, Object> response = creditCardService.deleteCardById(id);
        return ResponseEntity.ok(response);
    } catch (NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Card not found.");
    }
}

@PutMapping("/cards/default")
public ResponseEntity<?> setDefaultCard(@RequestBody Map<String, Long> payload) {
    Long id = payload.get("id");
    try {
        creditCardService.setDefaultCard(id);
        return ResponseEntity.ok("Default card set successfully.");
    } catch (NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Card not found.");
    }
}


