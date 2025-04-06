package org.example.greengrocer.service;

import java.util.List;
import java.util.Optional;

import org.example.greengrocer.model.DiscountedProduct;
import org.example.greengrocer.model.Product;
import org.example.greengrocer.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final DiscountedProductService discountedProductService;

    @Autowired
    public ProductService(ProductRepository productRepository, DiscountedProductService discountedProductService) {
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
    public Product addProduct(Product product, double price, double discountedPrice, int discountRate) {
        // Ürünü kaydet
        Product savedProduct = productRepository.save(product);

        // Eğer indirim uygulanacaksa
        if (discountRate > 0 || discountedPrice < price) {
            // İlgili DiscountedProduct'ı oluştur ve kaydet
            DiscountedProduct discountedProduct = new DiscountedProduct();
            discountedProduct.setProduct(savedProduct);
            discountedProduct.setOldPrice(price);
            discountedProduct.setDiscountedPrice(discountedPrice);
            discountedProduct.setDiscountRate(discountRate);

            discountedProductService.addDiscountedProduct(discountedProduct);
        }

        return savedProduct;
    }

    @Transactional
    public Product applyDiscount(Long productId, double oldPrice, double discountedPrice, int discountRate) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();

            // İlgili DiscountedProduct'ı oluştur ve kaydet
            DiscountedProduct discountedProduct = new DiscountedProduct();
            discountedProduct.setProduct(product);
            discountedProduct.setOldPrice(oldPrice);
            discountedProduct.setDiscountedPrice(discountedPrice);
            discountedProduct.setDiscountRate(discountRate);

            discountedProductService.addDiscountedProduct(discountedProduct);

            // Ürünün fiyatını indirimli fiyatla güncelle
            product.setPrice(discountedPrice);
            return productRepository.save(product);
        }
        return null;
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