package org.example.greengrocer.repository;

import java.util.List;

import org.example.greengrocer.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByProductKeyContainingIgnoreCase(String productKey);


    List<Product> findByCategoryContainingIgnoreCase(String category);
}