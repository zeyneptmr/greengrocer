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

import org.springframework.web.bind.annotation.RequestParam;
import org.example.greengrocer.model.Product;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/discountedProducts")
@CrossOrigin(origins = {"http://localhost:3000",}, allowCredentials = "true")
public class DiscountedProductController {

    @Autowired
    private DiscountedProductService discountedProductService;

    @GetMapping
    public ResponseEntity<List<?>> getAllDiscountedProducts(
            @RequestParam(name = "language", defaultValue = "en") String language) {

        List<DiscountedProduct> discounts = discountedProductService.getAllActiveDiscountsByLanguage(language);

        List<Map<String, Object>> response = discounts.stream().map(dp -> {
            Product p = dp.getProduct();
            Map<String, Object> map = new HashMap<>();
            map.put("id", dp.getId());
            map.put("oldPrice", dp.getOldPrice());
            map.put("discountedPrice", dp.getDiscountedPrice());
            map.put("discountRate", dp.getDiscountRate());
            map.put("discountDate", dp.getDiscountDate());

            Map<String, Object> productMap = new HashMap<>();
            productMap.put("id", p.getId());
            productMap.put("productKey", p.getProductKey());
            productMap.put("price", p.getPrice());
            productMap.put("stock", p.getStock());
            productMap.put("imagePath", p.getImagePath());
            productMap.put("category", p.getCategory());
            productMap.put("translatedName", p.getTranslatedName(language));

            map.put("product", productMap);

            return map;
        }).toList();

        return ResponseEntity.ok(response);
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