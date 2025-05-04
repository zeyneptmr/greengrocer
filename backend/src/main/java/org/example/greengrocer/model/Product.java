package org.example.greengrocer.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;


import java.util.List;

@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productKey;
    
    @Column(nullable = false)
    private double price;
    
    @Column(nullable = false)
    private int stock;
    
    @Column(nullable = false)
    private String imagePath;
    
    @Column(nullable = false)
    private String category;

    @OneToMany
    @JoinColumn(name = "productKey", referencedColumnName = "productKey", insertable = false, updatable = false)
    private List<ProductTranslation> productTranslations;
    
    
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getProductKey() { return productKey; }
    public void setProductKey(String productKey) { this.productKey = productKey; }
    
    public double getPrice() { 
        return price; 
    }
    
    public void setPrice(double price) { 
        this.price = price; 
    }
    
    public int getStock() { 
        return stock; 
    }
    
    public void setStock(int stock) { 
        this.stock = stock; 
    }
    
    public String getImagePath() { 
        return imagePath; 
    }
    
    public void setImagePath(String imagePath) { 
        this.imagePath = imagePath; 
    }
    
    public String getCategory() { 
        return category; 
    }
    
    public void setCategory(String category) { 
        this.category = category; 
    }


    public List<ProductTranslation> getProductTranslations() {
        return productTranslations;
    }

    public void setProductTranslations(List<ProductTranslation> productTranslations) {
        this.productTranslations = productTranslations;
    }

    // ---- TRANSLATED NAME METODU ----
    public String getTranslatedName(String language) {
        if (this.productTranslations == null) return productKey;

        return this.productTranslations.stream()
                .filter(t -> t.getLanguage().equalsIgnoreCase(language))
                .findFirst()
                .map(ProductTranslation::getTranslatedName)
                .orElse(productKey); // Eğer çeviri yoksa productKey dön
    }



}