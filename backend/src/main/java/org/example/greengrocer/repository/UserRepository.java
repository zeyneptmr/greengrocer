package org.example.greengrocer.repository;

import java.util.Optional;

import org.example.greengrocer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    Optional<User> findByEmailAndPassword(String email, String password);

    Optional<User> findByEmail(String email);
    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByRole(String role);

    long countByRole(String role);
}