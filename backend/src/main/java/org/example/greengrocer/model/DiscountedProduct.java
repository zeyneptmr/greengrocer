package org.example.greengrocer.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "discounted_products")
@NoArgsConstructor
@AllArgsConstructor
public class DiscountedProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false)
    private double oldPrice;
    
    @Column(nullable = false)
    private double discountedPrice;
    
    @Column(nullable = false)
    private int discountRate;
    
    @Column(nullable = false)
    private LocalDateTime discountDate;
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Product getProduct() {
        return product;
    }
    
    public void setProduct(Product product) {
        this.product = product;
    }
    
    public double getOldPrice() {
        return oldPrice;
    }
    
    public void setOldPrice(double oldPrice) {
        this.oldPrice = oldPrice;
    }
    
    public double getDiscountedPrice() {
        return discountedPrice;
    }
    
    public void setDiscountedPrice(double discountedPrice) {
        this.discountedPrice = discountedPrice;
    }
    
    public int getDiscountRate() {
        return discountRate;
    }
    
    public void setDiscountRate(int discountRate) {
        this.discountRate = discountRate;
    }
    
    public LocalDateTime getDiscountDate() {
        return discountDate;
    }
    
    public void setDiscountDate(LocalDateTime discountDate) {
        this.discountDate = discountDate;
    }
}