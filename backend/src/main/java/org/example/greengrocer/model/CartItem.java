package org.example.greengrocer.model;

import jakarta.persistence.*;
@Entity
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // productRef alanını kaldırıyoruz
    // @ManyToOne
    // @JoinColumn(name = "product_ref")
    // private Product product; // Bunu kullanmıyoruz

    private Long productId;  // Ürün ID'si, product ile ilişkili olmayan bir alan
    private String name;
    private String imagePath;
    private int quantity;
    private Double price;  // Fiyat

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
}
