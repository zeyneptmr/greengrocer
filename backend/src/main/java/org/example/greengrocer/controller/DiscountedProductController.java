package org.example.greengrocer.controller;

import java.util.List;

import org.example.greengrocer.model.DiscountedProduct;
import org.example.greengrocer.service.DiscountedProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/discountedProducts")
@CrossOrigin(origins = {"http://localhost:3000",}, allowCredentials = "true")
public class DiscountedProductController {

    @Autowired
    private DiscountedProductService discountedProductService;

    @GetMapping
    public ResponseEntity<List<DiscountedProduct>> getAllDiscountedProducts() {
        List<DiscountedProduct> products = discountedProductService.getAllActiveDiscounts();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<?> createDiscountedProduct(@RequestBody DiscountedProduct discountedProduct) {
        DiscountedProduct savedProduct = discountedProductService.createDiscount(discountedProduct);
        return ResponseEntity.ok(savedProduct);
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateDiscount(@PathVariable Long id) {
        boolean deactivated = discountedProductService.deactivateDiscount(id);
        
        if (deactivated) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    

    @PostMapping("/check-expired")
    public ResponseEntity<?> checkExpiredDiscounts() {
        discountedProductService.checkAndDeactivateExpiredDiscounts();
        return ResponseEntity.ok().body("Expired discounts check triggered successfully");
    }
}