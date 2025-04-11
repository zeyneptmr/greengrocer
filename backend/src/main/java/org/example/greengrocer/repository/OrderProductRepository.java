package org.example.greengrocer.repository;
import org.example.greengrocer.model.CustomerOrder;


import org.example.greengrocer.model.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderProductRepository extends JpaRepository<OrderProduct, Long> {
    List<OrderProduct>  findByCustomerOrder_OrderId(String orderId);

    List<OrderProduct> findByCustomerOrder(CustomerOrder customerOrder);

    List<OrderProduct> findByCustomerOrder_OrderIdAndCustomerOrder_User_Email(String orderId, String email);




}
