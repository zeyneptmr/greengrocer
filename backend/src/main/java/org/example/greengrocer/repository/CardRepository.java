package org.example.greengrocer.repository;

import java.util.List;

import org.example.greengrocer.model.Card;
import org.example.greengrocer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByUser(User user);

    @Transactional
    void deleteAllByUserId(Long userId);
}
