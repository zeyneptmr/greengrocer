package org.example.greengrocer.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.example.greengrocer.model.DiscountedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountedProductRepository extends JpaRepository<DiscountedProduct, Long> {
    
    @Query("SELECT dp FROM DiscountedProduct dp WHERE dp.active = true")
    List<DiscountedProduct> findAllActiveDiscounts();
    
    @Query("SELECT dp FROM DiscountedProduct dp WHERE dp.discountDate < :date AND dp.active = true")
    List<DiscountedProduct> findExpiredDiscounts(LocalDateTime date);


    @Query("SELECT DISTINCT dp FROM DiscountedProduct dp " +
            "LEFT JOIN FETCH dp.product p " +
            "LEFT JOIN FETCH p.productTranslations pt " +
            "WHERE dp.active = true AND pt.language = :language")
    List<DiscountedProduct> findAllActiveDiscountsByLanguage(String language);

}