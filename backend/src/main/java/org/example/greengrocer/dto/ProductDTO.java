package org.example.greengrocer.dto;

public class ProductDTO {
    private Long id;
    private String productKey;
    private String translatedName;
    private double price;
    private int stock;
    private String category;
    private String imagePath;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductKey() { return productKey; }
    public void setProductKey(String productKey) { this.productKey = productKey; }

    public String getTranslatedName() { return translatedName; }
    public void setTranslatedName(String translatedName) { this.translatedName = translatedName; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
}
