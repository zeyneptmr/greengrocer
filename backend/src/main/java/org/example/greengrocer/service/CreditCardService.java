package org.example.greengrocer.service;

import java.util.List;
import java.util.Optional;

import org.example.greengrocer.model.CreditCard;
import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.CreditCardRepository;
import org.example.greengrocer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreditCardService {

    @Autowired
    private CreditCardRepository creditCardRepository;

    @Autowired
    private UserRepository userRepository;

    public CreditCard saveCard(String email, CreditCard card) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) throw new RuntimeException("User not found");

        card.setUser(userOpt.get());
        return creditCardRepository.save(card);
    }

    public List<CreditCard> getUserCards(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) throw new RuntimeException("User not found");

        return creditCardRepository.findByUser(userOpt.get());
    }
}
public Map<String, Object> deleteCardById(Long id) {
    CreditCard card = creditCardRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Card not found"));

    creditCardRepository.delete(card);

    List<CreditCard> updatedCards = creditCardRepository.findAll();
    Long defaultCardId = updatedCards.isEmpty() ? null : updatedCards.get(0).getId();

    Map<String, Object> response = new HashMap<>();
    response.put("cards", updatedCards);
    response.put("defaultCardId", defaultCardId);

    return response;
}
public void setDefaultCard(Long id) {
    CreditCard card = creditCardRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Card not found"));

    List<CreditCard> allCards = creditCardRepository.findAll();
    for (CreditCard c : allCards) {
        c.setDefault(false);
    }

    card.setDefault(true);
    creditCardRepository.saveAll(allCards);
}
