package org.example.greengrocer.service;

import java.util.List;
import java.util.Optional;

import org.example.greengrocer.model.Product;
import org.example.greengrocer.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.example.greengrocer.model.DiscountedProduct;


import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    private final DiscountedProductService discountedProductService;


    @Autowired
    public ProductService(ProductRepository productRepository,  DiscountedProductService discountedProductService)
    {
        this.productRepository = productRepository;
        this.discountedProductService = discountedProductService;
    }
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Transactional
    // Yeni bir ürün eklerken, ona bağlı DiscountedProduct ekle
    public Product addProduct(Product product, double oldPrice, double discountedPrice, int discountRate) {
        // Ürünü kaydet
        Product savedProduct = productRepository.save(product);

        // İlgili DiscountedProduct'ı oluştur ve kaydet
        DiscountedProduct discountedProduct = new DiscountedProduct();
        discountedProduct.setProduct(product); // varsa, ilişkili ürün
        discountedProduct.setDiscountRate(discountRate);
        discountedProduct.setDiscountedPrice(discountedPrice);
        discountedProduct.setDuration(duration); // bu alan varsa ekle

        discountedProductService.addDiscountedProduct(discountedProduct);

        return savedProduct;
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