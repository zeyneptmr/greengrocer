package org.example.greengrocer.repository;

import org.example.greengrocer.model.CartItem;
import org.example.greengrocer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProductId(User user, Long productId);

    @Transactional
    void deleteAllByUserId(Long userId);

    @Transactional
    void deleteByProductId(Long productId);
}
