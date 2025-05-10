package org.example.greengrocer.repository;

import java.util.List;
import java.util.Optional;

import org.example.greengrocer.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    Optional<Favorite> findByUserIdAndProductId(Long userId, Long productId);
    
    @Transactional
    void deleteByUserIdAndProductId(Long userId, Long productId);

    @Transactional
    void deleteAllByUserId(Long userId);

    @Transactional
    void deleteByProductId(Long productId);

}