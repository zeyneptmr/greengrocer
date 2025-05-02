package org.example.greengrocer.controller;

import org.example.greengrocer.model.ProductTranslation;
import org.example.greengrocer.service.ProductTranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/product-translations")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductTranslationController {

    private final ProductTranslationService translationService;

    @Autowired
    public ProductTranslationController(ProductTranslationService translationService) {
        this.translationService = translationService;
    }

    @GetMapping("/{productKey}/{language}")
    public ResponseEntity<ProductTranslation> getTranslation(
            @PathVariable String productKey,
            @PathVariable String language) {
        Optional<ProductTranslation> translation = translationService.getTranslation(productKey, language);
        return translation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{language}")
    public List<ProductTranslation> getAllTranslations(@PathVariable String language) {
        return translationService.getAllTranslations(language);
    }

    @PostMapping
    public ProductTranslation addTranslation(@RequestBody ProductTranslation translation) {
        return translationService.saveTranslation(translation);
    }
}
