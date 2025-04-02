package org.example.greengrocer.repository;

import java.util.Optional;

import org.example.greengrocer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    // Email'in var olup olmadığını kontrol eder
    boolean existsByEmail(String email);

    // Email ve password'e göre kullanıcıyı bulur (Optional döndürülmeli)
    Optional<User> findByEmailAndPassword(String email, String password);

    // Email'e göre kullanıcıyı bulur (Optional döndürülmeli)
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailIgnoreCase(String email);

    // Role'e göre kullanıcı var mı diye kontrol eder
    boolean existsByRole(String role);  // Burada yeni eklenen metod
}
