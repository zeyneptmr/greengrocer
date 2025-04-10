// --- MODEL: CustomerOrder.java ---
package org.example.greengrocer.model;

import org.example.greengrocer.service.OrderIdGenerator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;



import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

import java.util.List;
import java.util.ArrayList;


@Entity
public class CustomerOrder {
    @Id
    private String orderId;


    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"name", "surname", "password", "phoneNumber", "role", "enabled", "credentialsNonExpired", "accountNonExpired", "accountNonLocked"})
    private User user;

    @OneToMany(mappedBy = "customerOrder", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderStatus> statusHistory = new ArrayList<>();

    private String latestStatus;

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

    /*public String getLatestStatus() {
        if (statusHistory == null || statusHistory.isEmpty()) {
            return "Sipariş Alındı";
        }
        return statusHistory.get(statusHistory.size() - 1).getStatus();
    }*/

    public String getLatestStatus() {
        return latestStatus;
    }

    public void setLatestStatus(String latestStatus) {
        this.latestStatus = latestStatus;
    }


    // Getters and setters...
}
