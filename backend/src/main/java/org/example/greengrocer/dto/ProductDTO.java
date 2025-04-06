package org.example.greengrocer.dto;

import org.example.greengrocer.model.Product;

public class ProductDTO {
    private Product product;
    private double price;
    private double discountedPrice;
    private int discountRate;

    public ProductDTO() {
    }

    public ProductDTO(Product product, double price, double discountedPrice, int discountRate) {
        this.product = product;
        this.price = price;
        this.discountedPrice = discountedPrice;
        this.discountRate = discountRate;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
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
}