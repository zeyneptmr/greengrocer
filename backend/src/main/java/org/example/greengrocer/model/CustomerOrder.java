// --- MODEL: CustomerOrder.java ---
package org.example.greengrocer.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.example.greengrocer.service.OrderIdGenerator;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;


@Entity
public class CustomerOrder {
    @Id
    private String orderId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "customerOrder", cascade = CascadeType.ALL)
    private List<OrderStatus> statusHistory = new ArrayList<>();

    private String userEmail;

    private String shippingAddress;

    private double productTotal;

    private double shippingFee;

    private double totalAmount;

    private LocalDateTime createdAt = LocalDateTime.now();

    public CustomerOrder() {
        this.orderId = OrderIdGenerator.generateOrderId();
        this.createdAt = LocalDateTime.now();
    }

    public String getOrderId() {
        return orderId;
    }


    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public List<OrderStatus> getStatusHistory() {
        return statusHistory;
    }

    public void setStatusHistory(List<OrderStatus> statusHistory) {
        this.statusHistory = statusHistory;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public double getProductTotal() {
        return productTotal;
    }

    public void setProductTotal(double productTotal) {
        this.productTotal = productTotal;
    }

    public double getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(double shippingFee) {
        this.shippingFee = shippingFee;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Getters and setters...
}
