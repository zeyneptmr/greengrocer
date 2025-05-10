package org.example.greengrocer.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.example.greengrocer.model.DiscountedProduct;
import org.example.greengrocer.model.Product;
import org.example.greengrocer.repository.DiscountedProductRepository;
import org.example.greengrocer.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DiscountedProductService {

    @Autowired
    private DiscountedProductRepository discountedProductRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<DiscountedProduct> getAllActiveDiscounts() {
        return discountedProductRepository.findAllActiveDiscounts();
    }

    public List<DiscountedProduct> getAllActiveDiscountsByLanguage(String language) {
        return discountedProductRepository.findAllActiveDiscountsByLanguage(language);
    }

    @Transactional
    public DiscountedProduct createDiscount(DiscountedProduct discountedProduct) {
        
        if (discountedProduct.getDiscountDate() == null) {
            discountedProduct.setDiscountDate(LocalDateTime.now());
        }
        
    
        discountedProduct.setActive(true);
        
        
        return discountedProductRepository.save(discountedProduct);
    }
    
    @Transactional
    public boolean deactivateDiscount(Long discountId) {
        Optional<DiscountedProduct> optionalDiscount = discountedProductRepository.findById(discountId);
        
        if (optionalDiscount.isPresent()) {
            DiscountedProduct discount = optionalDiscount.get();
            
        
            if (!discount.isActive()) {
                return false;
            }
            
        
            discount.setActive(false);
            discountedProductRepository.save(discount);
            
        
            restoreOriginalPrice(discount);
            
            return true;
        }
        
        return false;
    }
    
    @Transactional
    public void checkAndDeactivateExpiredDiscounts() {
        
        LocalDateTime oneDayAgo = LocalDateTime.now().minusHours(24);
        List<DiscountedProduct> expiredDiscounts = discountedProductRepository.findExpiredDiscounts(oneDayAgo);
        
        for (DiscountedProduct discount : expiredDiscounts) {
        
            discount.setActive(false);
            discountedProductRepository.save(discount);
            
            
            restoreOriginalPrice(discount);
        }
    }
    
    private void restoreOriginalPrice(DiscountedProduct discount) {
        Product product = discount.getProduct();
        
        
        if (product != null && product.getId() != null) {
            Optional<Product> currentProduct = productRepository.findById(product.getId());
            if (currentProduct.isPresent()) {
                Product updatedProduct = currentProduct.get();
                updatedProduct.setPrice(discount.getOldPrice());
                productRepository.save(updatedProduct);
            }
        }
    }
}