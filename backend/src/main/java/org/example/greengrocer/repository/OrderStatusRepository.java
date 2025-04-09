package org.example.greengrocer.repository;

import org.example.greengrocer.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderStatusRepository extends JpaRepository<OrderStatus, Long> {
    // orderId'yi String olarak bekleyin
    List<OrderStatus> findByCustomerOrderOrderIdOrderByTimestampAsc(String orderId);
}
