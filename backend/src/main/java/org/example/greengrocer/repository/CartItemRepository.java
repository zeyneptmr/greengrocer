package org.example.greengrocer.repository;

import org.example.greengrocer.model.CartItem;
import org.example.greengrocer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Kullanıcıya ait sepet ürünlerini getiren metot
    List<CartItem> findByUser(User user);

    // Kullanıcının sepetindeki ürünü bulmak için
    Optional<CartItem> findByUserAndProductId(User user, Long productId);
}
