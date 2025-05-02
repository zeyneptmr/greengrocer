package org.example.greengrocer.repository;

import org.example.greengrocer.model.ProductTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductTranslationRepository extends JpaRepository<ProductTranslation, Long> {

    Optional<ProductTranslation> findByProductKeyAndLanguage(String productKey, String language);

    List<ProductTranslation> findByLanguage(String language);
}
