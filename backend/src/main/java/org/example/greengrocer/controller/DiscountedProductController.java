package org.example.greengrocer.controller;

import java.util.List;

import org.example.greengrocer.model.DiscountedProduct;
import org.example.greengrocer.service.DiscountedProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/discountedProducts")
@CrossOrigin(origins = "http://localhost:3000")  // React ile iletişim için
public class DiscountedProductController {

    private final DiscountedProductService discountedProductService;

    @Autowired
    public DiscountedProductController(DiscountedProductService discountedProductService) {
        this.discountedProductService = discountedProductService;
    }

    // İndirimli ürün ekleme
    @PostMapping
    public ResponseEntity<DiscountedProduct> addDiscountedProduct(@RequestBody DiscountedProduct discountedProduct) {
        DiscountedProduct savedProduct = discountedProductService.addDiscountedProduct(discountedProduct);
        return ResponseEntity.status(201).body(savedProduct);
    }

    // Tüm indirimli ürünleri listeleme
    @GetMapping
    public List<DiscountedProduct> getAllDiscountedProducts() {
        return discountedProductService.getAllDiscountedProducts();
    }
}