package org.example.greengrocer.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.example.greengrocer.model.DiscountedProduct;
import org.example.greengrocer.repository.DiscountedProductRepository;
import org.example.greengrocer.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class DiscountedProductService {

    private final DiscountedProductRepository discountedProductRepository;
    private final ProductRepository productRepository;

    @Autowired
    public DiscountedProductService(DiscountedProductRepository discountedProductRepository, ProductRepository productRepository) {
        this.discountedProductRepository = discountedProductRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public DiscountedProduct addDiscountedProduct(DiscountedProduct discountedProduct) {
        String dateStr = new Timestamp(System.currentTimeMillis()).toString();
        discountedProduct.setDiscountDate(dateStr);
        return discountedProductRepository.save(discountedProduct);
    }


    // Tüm indirimli ürünleri getir
    public List<DiscountedProduct> getAllDiscountedProducts() {
        return discountedProductRepository.findAll();
    }

    // ID'ye göre indirimli ürünü getir
    public Optional<DiscountedProduct> getDiscountedProductById(Long id) {
        return discountedProductRepository.findById(id);
    }

    // İndirimli ürünü güncelle
    public DiscountedProduct updateDiscountedProduct(DiscountedProduct discountedProduct) {
        return discountedProductRepository.save(discountedProduct);
    }

    // İndirimli ürünü sil
    public void deleteDiscountedProduct(Long id) {
        discountedProductRepository.deleteById(id);
    }

    // İndirimli ürünlerin stok bilgisini güncelle
    public DiscountedProduct updateDiscountedProductStock(Long id, int newStock) {
        Optional<DiscountedProduct> discountedProductOpt = discountedProductRepository.findById(id);
        if (discountedProductOpt.isPresent()) {
            DiscountedProduct discountedProduct = discountedProductOpt.get();
            return discountedProductRepository.save(discountedProduct);
        }
        return null;
    }

    // İndirimli ürünlerin fiyat aralığına göre arama
    public List<DiscountedProduct> getDiscountedProductsByPriceRange(double minPrice, double maxPrice) {
        return discountedProductRepository.findByDiscountedPriceBetween(minPrice, maxPrice);
    }

    // İndirimli ürünlerin indirim oranına göre arama
    public List<DiscountedProduct> getDiscountedProductsByDiscountRate(int discountRate) {
        return discountedProductRepository.findByDiscountRate(discountRate);
    }

    // İndirimli ürünlerin tarihine göre arama
    public List<DiscountedProduct> getDiscountedProductsByDateBefore(String date) {
        return discountedProductRepository.findByDiscountDateBefore(date);
    }

    // Ürün adı ile indirimli ürün arama
    public List<DiscountedProduct> searchByProductName(String productName) {
        return discountedProductRepository.findByProductProductNameContainingIgnoreCase(productName);
    }

    // Kategori ile indirimli ürün arama
    public List<DiscountedProduct> searchByCategory(String category) {
        return discountedProductRepository.findByProductCategoryContainingIgnoreCase(category);
    }
}