package org.example.greengrocer.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.example.greengrocer.model.Product;
import org.example.greengrocer.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.example.greengrocer.repository.FavoriteRepository;
import org.example.greengrocer.repository.CartItemRepository;
import org.example.greengrocer.repository.DiscountedProductRepository;

import org.example.greengrocer.repository.OrderProductRepository;

import org.example.greengrocer.model.ProductTranslation;


@Service
public class ProductService {
    
    private final ProductRepository productRepository;

    @Autowired
    private FavoriteRepository favoritesRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private DiscountedProductRepository discountedProductRepository;

    @Autowired
    private OrderProductRepository orderProductRepository;

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

    @Transactional
    public void deleteProduct(Long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();

            if (orderProductRepository.existsByProductId(id)) {
                throw new IllegalStateException("Bu ürün silinemez çünkü geçmiş siparişlerde yer alıyor.");
            }

            favoritesRepository.deleteByProductId(id);
            cartItemRepository.deleteByProductId(id);
            discountedProductRepository.deleteByProductId(id);

            productRepository.deleteById(id);
        }
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
     public List<Product> searchByProductKey(String productKey) {
         return productRepository.findByProductKeyContainingIgnoreCase(productKey);
     }


    public List<Product> searchByCategory(String category) {
        return productRepository.findByCategoryContainingIgnoreCase(category);
    }


    public List<Product> getRandomProducts() {
        List<Product> allProducts = productRepository.findAll();
        Collections.shuffle(allProducts); 
        return allProducts.stream().limit(15).collect(Collectors.toList()); 
    }

    @Transactional
    public Product decreaseProductStock(Long productId, int quantity) {
        System.out.println("Decreasing stock for product ID: " + productId + " by quantity: " + quantity);

        Optional<Product> productOpt = getProductById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            System.out.println("Product found: " + product.getProductKey() + ", Current stock: " + product.getStock());
            int newStock = Math.max(0, product.getStock() - quantity);
            product.setStock(newStock);
            return updateProduct(product);
        }
        return null;
    }

    @Autowired
    private ProductTranslationService translationService;

    public List<Product> searchByTranslatedName(String translatedName, String language) {
        List<ProductTranslation> translations = translationService.searchByTranslatedName(translatedName, language);
        return translations.stream()
                .map(t -> productRepository.findByProductKey(t.getProductKey()))
                .flatMap(opt -> opt.stream())  // Optional varsa içindeki Product'ı açar
                .collect(Collectors.toList());
    }



}