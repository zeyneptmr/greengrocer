// AddressRepository.java
package org.example.greengrocer.repository;

import org.example.greengrocer.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import org.example.greengrocer.model.User;


import java.util.List;


public interface AddressRepository extends JpaRepository<Address, Long> {
    // Kullanıcıya ait adresleri alacak bir metod
    List<Address> findByUser(User user);
}
