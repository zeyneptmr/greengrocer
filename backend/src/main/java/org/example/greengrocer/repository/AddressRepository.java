package org.example.greengrocer.repository;

import java.util.List;
import java.util.Optional;

import org.example.greengrocer.model.Address;
import org.example.greengrocer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser(User user);

    Optional<Address> findByUserAndIsDefaultTrue(User user);

    @Transactional
    void deleteAllByUserId(Long userId);

}
