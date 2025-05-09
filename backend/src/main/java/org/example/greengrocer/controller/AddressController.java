package org.example.greengrocer.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.example.greengrocer.model.Address;
import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.AddressRepository;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Arrays;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenProvider tokenProvider;

    @PostMapping
    public ResponseEntity<?> saveAddress(@RequestBody Address incomingAddress, HttpServletRequest request) {
        String token = Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (token == null) {
            System.out.println("Token is missing");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is missing or invalid.");
        } else if (!tokenProvider.validateToken(token)) {
            System.out.println("Invalid token: " + token);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String email = tokenProvider.getEmailFromToken(token);
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();
        List<Address> userAddresses = addressRepository.findByUser(user);
        Boolean isFirstAddress = userAddresses.isEmpty();


        Address addressToSave = new Address();
        addressToSave.setFirstName(incomingAddress.getFirstName());
        addressToSave.setLastName(incomingAddress.getLastName());
        addressToSave.setEmail(incomingAddress.getEmail());
        addressToSave.setPhone(incomingAddress.getPhone());
        addressToSave.setCity(incomingAddress.getCity());
        addressToSave.setDistrict(incomingAddress.getDistrict());
        addressToSave.setNeighborhood(incomingAddress.getNeighborhood());
        addressToSave.setAddress(incomingAddress.getAddress());
        addressToSave.setDescription(incomingAddress.getDescription());
        addressToSave.setUser(userOpt.get());
        addressToSave.setIsDefault(isFirstAddress);

        addressRepository.save(addressToSave);
        return ResponseEntity.ok("Address saved successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateAddress(@PathVariable Long id, @RequestBody Address updatedAddress, HttpServletRequest request) {
        try {
            String token = Arrays.stream(request.getCookies())
                    .filter(c -> "token".equals(c.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);

            System.out.println("Token: " + token);

            if (token == null || !tokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            String email = tokenProvider.getEmailFromToken(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Address existingAddress = addressRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Address not found"));

            if (!existingAddress.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own address");
            }

            existingAddress.setFirstName(updatedAddress.getFirstName());
            existingAddress.setLastName(updatedAddress.getLastName());
            existingAddress.setEmail(updatedAddress.getEmail());
            existingAddress.setPhone(updatedAddress.getPhone());
            existingAddress.setCity(updatedAddress.getCity());
            existingAddress.setDistrict(updatedAddress.getDistrict());
            existingAddress.setNeighborhood(updatedAddress.getNeighborhood());
            existingAddress.setAddress(updatedAddress.getAddress());
            existingAddress.setDescription(updatedAddress.getDescription());

            addressRepository.save(existingAddress);

            return ResponseEntity.ok("Address updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<?> getAddresses(HttpServletRequest request) {
        String token = Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (token == null || !tokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String email = tokenProvider.getEmailFromToken(token);
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();
        List<Address> savedAddresses = addressRepository.findByUser(user);

        if (savedAddresses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No saved addresses found");
        }

        return ResponseEntity.ok(savedAddresses);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id, HttpServletRequest request) {
        String token = null;
        if (request.getCookies() != null) {
            token = Arrays.stream(request.getCookies())
                    .filter(c -> "token".equals(c.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);
        }

        if (token == null) {
            System.out.println("Token is missing or invalid.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is missing or invalid.");
        }

        String email = tokenProvider.getEmailFromToken(token);
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        Optional<Address> addressOpt = addressRepository.findById(id);
        if (addressOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Address not found");
        }

        Address address = addressOpt.get();
        if (!address.getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to delete this address.");
        }



        addressRepository.deleteById(id);
        return ResponseEntity.ok("Address deleted successfully.");
    }

    @PutMapping("/default")
    public ResponseEntity<?> setDefaultAddress(@RequestBody Map<String, Long> body, HttpServletRequest request) {
        Long addressId = body.get("id");
        if (addressId == null) {
            return ResponseEntity.badRequest().body("Address ID not found");
        }

        String token = Arrays.stream(request.getCookies())
                .filter(c -> "token".equals(c.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (token == null || !tokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String email = tokenProvider.getEmailFromToken(token);
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        Optional<Address> selectedAddressOpt = addressRepository.findById(addressId);
        if (selectedAddressOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Address not found");
        }

        Address selectedAddress = selectedAddressOpt.get();

        if (!selectedAddress.getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not allowed to update this address.");
        }

        List<Address> userAddresses = addressRepository.findByUser(userOpt.get());
        for (Address address : userAddresses) {
            address.setIsDefault(false);
        }

        selectedAddress.setIsDefault(true);
        addressRepository.saveAll(userAddresses);

        return ResponseEntity.ok("Default address set successfully.");
    }


}
