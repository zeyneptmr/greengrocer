package org.example.greengrocer.repository;

import org.example.greengrocer.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.greengrocer.model.User;
import java.util.List;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, String> {
    List<CustomerOrder> findByUserEmail(String email);

    List<CustomerOrder> findByUser(User user);

}
