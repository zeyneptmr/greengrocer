package org.example.greengrocer.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.example.greengrocer.model.CustomerOrder;
import org.example.greengrocer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;


public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, String> {
    List<CustomerOrder> findByUserEmail(String email);

    List<CustomerOrder> findByUser(User user);
    
    @Query("SELECT SUM(c.totalAmount) FROM CustomerOrder c")
    Double calculateTotalSales();

    List<CustomerOrder> findByUserId(Long userId);

    @Transactional
    void deleteAllByUserId(Long userId);

    List<CustomerOrder> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

}