package org.example.greengrocer.service;

import java.util.List;
import java.util.Optional;

import org.example.greengrocer.model.Product;
import org.example.greengrocer.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    
    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    public Product updateStock(Long id, int newStock) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setStock(newStock);
            return productRepository.save(product);
        }
        return null;
    }

     // Search methods
     public List<Product> searchByProductName(String productName) {
        return productRepository.findByProductNameContainingIgnoreCase(productName);
    }
    
    public List<Product> searchByCategory(String category) {
        return productRepository.findByCategoryContainingIgnoreCase(category);
    }



}