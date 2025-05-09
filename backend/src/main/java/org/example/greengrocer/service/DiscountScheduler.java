package org.example.greengrocer.service;

import java.time.LocalDateTime;
import java.util.List;

import org.example.greengrocer.model.DiscountedProduct;
import org.example.greengrocer.model.Product;
import org.example.greengrocer.repository.DiscountedProductRepository;
import org.example.greengrocer.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class DiscountScheduler {

    @Autowired
    private DiscountedProductRepository discountedProductRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    
    @Scheduled(fixedRate = 3600000)
    public void checkExpiredDiscounts() {
        LocalDateTime oneDayAgo = LocalDateTime.now().minusDays(1);
        List<DiscountedProduct> expiredDiscounts = discountedProductRepository.findExpiredDiscounts(oneDayAgo);
        
        for (DiscountedProduct discount : expiredDiscounts) {
        
            discount.setActive(false);
            discountedProductRepository.save(discount);
            
        
            Product product = discount.getProduct();
            product.setPrice(discount.getOldPrice());
            productRepository.save(product);
        }
    }
}