package org.example.greengrocer.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.example.greengrocer.dto.ProductDTO;
import org.example.greengrocer.model.Product;
import org.example.greengrocer.model.ProductTranslation;
import org.example.greengrocer.service.ProductService;
import org.example.greengrocer.service.ProductTranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")  // React ile iletişim için
public class ProductController {

    private final ProductService productService;
    private final ProductTranslationService translationService;

    @Autowired
    public ProductController(ProductService productService, ProductTranslationService translationService) {
        this.productService = productService;
        this.translationService = translationService;
    }

    @GetMapping
    public List<ProductDTO> getAllProducts(@RequestParam(defaultValue = "en") String language) {
        return productService.getAllProducts().stream()
                .map(product -> {
                    ProductDTO dto = new ProductDTO();
                    dto.setId(product.getId());
                    dto.setProductKey(product.getProductKey());
                    dto.setPrice(product.getPrice());
                    dto.setStock(product.getStock());
                    dto.setCategory(product.getCategory());
                    dto.setImagePath(product.getImagePath());

                    String translated = translationService.getTranslation(product.getProductKey(), language)
                            .map(ProductTranslation::getTranslatedName)
                            .orElse(capitalizeWords(product.getProductKey().replace("_", " ")));
                    dto.setTranslatedName(translated);

                    return dto;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        Product savedProduct = productService.addProduct(product);

        String productKey = product.getProductKey();
        System.out.println("ÜRÜN KEY: " + productKey);

        // 1️⃣ İngilizce çeviri kontrol
        Optional<ProductTranslation> enTranslation = translationService.getTranslation(productKey, "en");
        if (enTranslation.isEmpty()) {
            ProductTranslation newEn = new ProductTranslation();
            newEn.setProductKey(productKey);
            newEn.setLanguage("en");

            // Alt çizgileri boşluk yap, kelimeleri büyük harfle başlat
            String englishName = capitalizeWords(productKey.replace("_", " "));
            newEn.setTranslatedName(englishName);

            System.out.println("İNGİLİZCE ÇEVİRİ KAYDEDİLİYOR: " + englishName);

            translationService.saveTranslation(newEn);
        } else {
            System.out.println("İngilizce çeviri zaten mevcut.");
        }

        // 2️⃣ Türkçe çeviri kontrol
        Optional<ProductTranslation> trTranslation = translationService.getTranslation(productKey, "tr");
        if (trTranslation.isEmpty()) {
            String translated = translationService.autoTranslate(productKey.replace("_", " "), "tr");
            System.out.println("ÇEVİRİ GELDİ (autoTranslate sonucu): " + translated);  // LOG

            ProductTranslation newTr = new ProductTranslation();
            newTr.setProductKey(productKey);
            newTr.setLanguage("tr");
            newTr.setTranslatedName(translated);

            System.out.println("TÜRKÇE ÇEVİRİ VERİTABANINA KAYDEDİLİYOR: " + translated);

            translationService.saveTranslation(newTr);
        } else {
            System.out.println("Türkçe çeviri zaten mevcut.");
        }

        return savedProduct;
    }


    @GetMapping("/random")
    public List<ProductDTO> getRandomProducts(@RequestParam(defaultValue = "en") String language) {
        return productService.getRandomProducts().stream()
                .map(product -> {
                    ProductDTO dto = new ProductDTO();
                    dto.setId(product.getId());
                    dto.setProductKey(product.getProductKey());
                    dto.setPrice(product.getPrice());
                    dto.setStock(product.getStock());
                    dto.setCategory(product.getCategory());
                    dto.setImagePath(product.getImagePath());

                    String translated = translationService.getTranslation(product.getProductKey(), language)
                            .map(ProductTranslation::getTranslatedName)
                            .orElse(capitalizeWords(product.getProductKey().replace("_", " ")));
                    dto.setTranslatedName(translated);

                    return dto;
                })
                .collect(Collectors.toList());
    }


    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        Product updatedProduct = productService.updateProduct(product);
        return ResponseEntity.ok(updatedProduct);
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<Product> updateStock(@PathVariable Long id, @RequestBody StockUpdateRequest stockUpdateRequest) {
        Optional<Product> productOpt = productService.getProductById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setStock(stockUpdateRequest.getStock());
            Product updatedProduct = productService.updateProduct(product);
            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public static class StockUpdateRequest {
        private int stock;

        public int getStock() {
            return stock;
        }

        public void setStock(int stock) {
            this.stock = stock;
        }
    }

    @PatchMapping("/{id}/update-price")
    public ResponseEntity<Product> updateProductPrice(@PathVariable Long id, @RequestBody PriceUpdateRequest priceUpdateRequest) {
        Optional<Product> productOpt = productService.getProductById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setPrice(priceUpdateRequest.getPrice());
            Product updatedProduct = productService.updateProduct(product);
            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public static class PriceUpdateRequest {
        private double price;

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/key")
    public List<Product> searchByProductKey(@RequestParam String productKey) {
        return productService.searchByProductKey(productKey);
    }

    @GetMapping("/search/category")
    public List<Product> searchByCategory(@RequestParam String category) {
        return productService.searchByCategory(category);
    }

    // ✅ KELİMELERİN BAŞ HARFLERİNİ BÜYÜT
    private String capitalizeWords(String str) {
        String[] words = str.split(" ");
        StringBuilder capitalized = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                capitalized.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1))
                        .append(" ");
            }
        }
        return capitalized.toString().trim();
    }

}