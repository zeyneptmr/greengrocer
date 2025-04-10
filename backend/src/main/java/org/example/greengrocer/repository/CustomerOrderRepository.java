package org.example.greengrocer.repository;

import java.util.List;

import org.example.greengrocer.model.CustomerOrder;
import org.example.greengrocer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, String> {
    List<CustomerOrder> findByUserEmail(String email);

    List<CustomerOrder> findByUser(User user);
    
    @Query("SELECT SUM(c.totalAmount) FROM CustomerOrder c")
    Double calculateTotalSales();

}
