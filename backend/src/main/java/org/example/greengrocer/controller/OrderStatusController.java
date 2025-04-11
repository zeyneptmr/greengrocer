package org.example.greengrocer.controller;

import java.util.List;

import org.example.greengrocer.model.OrderStatus;
import org.example.greengrocer.repository.OrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/order-status")
public class OrderStatusController {

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    // Belirli bir siparişin statü geçmişini getir
    @GetMapping("/history/{orderId}")
    public ResponseEntity<List<OrderStatus>> getStatusHistory(@PathVariable String orderId) {
        List<OrderStatus> statusList = orderStatusRepository.findByCustomerOrderOrderIdOrderByTimestampAsc(orderId);
        return ResponseEntity.ok(statusList);
    }


    @GetMapping("/count")
    public ResponseEntity<Long> getOrderStatusCount() {
    long count = orderStatusRepository.findOrderCount();
    return ResponseEntity.ok(count);
}

}
