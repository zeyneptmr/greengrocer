package org.example.greengrocer.repository;

import java.util.List;

import org.example.greengrocer.model.DiscountedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.transaction.annotation.Transactional;

@Repository
public interface DiscountedProductRepository extends JpaRepository<DiscountedProduct, Long> {

    // İndirimli ürünlerin fiyatına göre arama yapma
    List<DiscountedProduct> findByDiscountedPriceBetween(double minPrice, double maxPrice);

    // İndirim oranına göre arama yapma
    List<DiscountedProduct> findByDiscountRate(int discountRate);

    // İndirimli ürünlerin indirim tarihine göre arama yapma (örneğin, belirli bir tarihten önce)
    List<DiscountedProduct> findByDiscountDateBefore(String date);

    // Ürünün adını içeren indirimli ürünleri bulma
    List<DiscountedProduct> findByProductProductNameContainingIgnoreCase(String productName);

    // Ürün kategorisine göre indirimli ürünler
    List<DiscountedProduct> findByProductCategoryContainingIgnoreCase(String category);
}
