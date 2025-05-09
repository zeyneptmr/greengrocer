package org.example.greengrocer.repository;

import java.util.List;

import org.example.greengrocer.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderStatusRepository extends JpaRepository<OrderStatus, Long> {
    List<OrderStatus> findByCustomerOrderOrderIdOrderByTimestampAsc(String orderId);

    @Query("SELECT COUNT(o) FROM OrderStatus o")
    long findOrderCount();
}
