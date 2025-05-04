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
import org.example.greengrocer.dto.ProductUpdateRequest;


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

    /*@GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }*/

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id, @RequestParam(defaultValue = "en") String language) {
        Optional<Product> productOpt = productService.getProductById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
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

            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {

        Product savedProduct = productService.addProduct(product);

        String productKey = product.getProductKey();
        System.out.println("========================================");
        System.out.println("ÜRÜN KEY: " + productKey);

        //  language detection
        String detectedLanguage = translationService.detectLanguage(productKey.replace("_", " "));
        System.out.println("Algılanan dil: " + detectedLanguage);

        // English translate control
        Optional<ProductTranslation> enTranslation = translationService.getTranslation(productKey, "en");
        if (enTranslation.isEmpty()) {
            System.out.println("İngilizce çeviri bulunamadı. Çeviri yapılıyor...");
            String translated = translationService.autoTranslate(productKey.replace("_", " "), detectedLanguage, "en");
            ProductTranslation newEn = new ProductTranslation();
            newEn.setProductKey(productKey);
            newEn.setLanguage("en");
            newEn.setTranslatedName(translated);
            translationService.saveTranslation(newEn);
        } else {
            System.out.println("İngilizce çeviri zaten mevcut: " + enTranslation.get().getTranslatedName());
        }

        //  Turkish translate control
        Optional<ProductTranslation> trTranslation = translationService.getTranslation(productKey, "tr");
        if (trTranslation.isEmpty()) {
            System.out.println("Türkçe çeviri bulunamadı. Çeviri yapılıyor...");
            String translated = translationService.autoTranslate(productKey.replace("_", " "), detectedLanguage, "tr");
            ProductTranslation newTr = new ProductTranslation();
            newTr.setProductKey(productKey);
            newTr.setLanguage("tr");
            newTr.setTranslatedName(translated);
            translationService.saveTranslation(newTr);
        } else {
            System.out.println("Türkçe çeviri zaten mevcut: " + trTranslation.get().getTranslatedName());
        }

        System.out.println("========================================");

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

   /* @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        Product updatedProduct = productService.updateProduct(product);
        return ResponseEntity.ok(updatedProduct);
    }*/


    /*@PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        Product updatedProduct = productService.updateProduct(product);

        // Translation
        String productKey = product.getProductKey();
        String detectedLanguage = translationService.detectLanguage(product.getProductKey().replace("_", " "));
        System.out.println("Algılanan dil: " + detectedLanguage);

        if (detectedLanguage.equals("en")) {
            Optional<ProductTranslation> enTranslation = translationService.getTranslation(productKey, "en");
            if (enTranslation.isPresent()) {
                ProductTranslation translation = enTranslation.get();
                translation.setTranslatedName(capitalizeWords(product.getProductKey().replace("_", " ")));
                translationService.saveTranslation(translation);
            } else {
                ProductTranslation newTranslation = new ProductTranslation();
                newTranslation.setProductKey(productKey);
                newTranslation.setLanguage("en");
                newTranslation.setTranslatedName(capitalizeWords(product.getProductKey().replace("_", " ")));
                translationService.saveTranslation(newTranslation);
            }
        } else if (detectedLanguage.equals("tr")) {
            Optional<ProductTranslation> trTranslation = translationService.getTranslation(productKey, "tr");
            if (trTranslation.isPresent()) {
                ProductTranslation translation = trTranslation.get();
                translation.setTranslatedName(capitalizeWords(product.getProductKey().replace("_", " ")));
                translationService.saveTranslation(translation);
            } else {
                ProductTranslation newTranslation = new ProductTranslation();
                newTranslation.setProductKey(productKey);
                newTranslation.setLanguage("tr");
                newTranslation.setTranslatedName(capitalizeWords(product.getProductKey().replace("_", " ")));
                translationService.saveTranslation(newTranslation);
            }
        }

        return ResponseEntity.ok(updatedProduct);
    }
*/

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductUpdateRequest updateRequest) {

        Optional<Product> optionalProduct = productService.getProductById(id);
        if (!optionalProduct.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Product product = optionalProduct.get();
        product.setPrice(updateRequest.getPrice());
        product.setStock(updateRequest.getStock());
        product.setCategory(updateRequest.getCategory());
        product.setImagePath(updateRequest.getImagePath());

        productService.updateProduct(product);  // Ana ürün güncellemesi

        // Çeviri güncellemesi:
        if (updateRequest.getTranslatedName() != null && updateRequest.getLanguage() != null) {
            Optional<ProductTranslation> translationOpt =
                    translationService.getTranslation(product.getProductKey(), updateRequest.getLanguage());

            if (translationOpt.isPresent()) {
                ProductTranslation translation = translationOpt.get();
                translation.setTranslatedName(updateRequest.getTranslatedName());
                translationService.saveTranslation(translation);
            } else {
                ProductTranslation newTranslation = new ProductTranslation();
                newTranslation.setProductKey(product.getProductKey());
                newTranslation.setLanguage(updateRequest.getLanguage());
                newTranslation.setTranslatedName(updateRequest.getTranslatedName());
                translationService.saveTranslation(newTranslation);
            }
        }

        return ResponseEntity.ok(product);
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


    @GetMapping("/search/name")
    public List<ProductDTO> searchByTranslatedName(
            @RequestParam String productName,
            @RequestParam(defaultValue = "en") String language) {

        List<Product> products = productService.searchByTranslatedName(productName, language);

        return products.stream().map(product -> {
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
        }).collect(Collectors.toList());
    }

}