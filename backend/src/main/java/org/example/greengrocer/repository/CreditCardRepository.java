package org.example.greengrocer.repository;

import java.util.List;
import org.example.greengrocer.model.CreditCard;
import org.example.greengrocer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditCardRepository extends JpaRepository<CreditCard, Long> {
    List<CreditCard> findByUser(User user);
}
