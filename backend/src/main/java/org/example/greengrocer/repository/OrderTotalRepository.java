package org.example.greengrocer.repository;

import org.example.greengrocer.model.OrderTotal;
import org.example.greengrocer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrderTotalRepository extends JpaRepository<OrderTotal, Long> {
    Optional<OrderTotal> findByUser(User user);
    void deleteByUser(User user);

}
