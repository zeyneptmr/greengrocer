package org.example.greengrocer.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.example.greengrocer.dto.ProductDTO;
import org.example.greengrocer.model.Favorite;
import org.example.greengrocer.model.Product;
import org.example.greengrocer.model.ProductTranslation;
import org.example.greengrocer.model.User;
import org.example.greengrocer.repository.FavoriteRepository;
import org.example.greengrocer.repository.ProductRepository;
import org.example.greengrocer.repository.ProductTranslationRepository;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.security.TokenProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductTranslationRepository translationRepository;
    private final TokenProvider tokenProvider;

    public FavoriteService(FavoriteRepository favoriteRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository,
                           ProductTranslationRepository translationRepository,
                           TokenProvider tokenProvider) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.translationRepository = translationRepository;
        this.tokenProvider = tokenProvider;
    }

    public Long getUserIdFromRequest(HttpServletRequest request) {
        String token = null;

        // Önce cookie içinden token al
        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        // Eğer cookie'den alınamazsa, Authorization header'dan dene
        if (token == null) {
            String bearerToken = request.getHeader("Authorization");
            if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
                token = bearerToken.substring(7);
            }
        }

        if (token == null) {
            throw new RuntimeException("JWT bulunamadı");
        }

        String email = tokenProvider.getEmailFromToken(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email)).getId();
    }

    public List<ProductDTO> getUserFavoritesWithTranslation(Long userId, String language) {
        System.out.println("Fetching favorites for userId: " + userId + " with language: " + language);
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        System.out.println("Found " + favorites.size() + " favorites for user");

        return favorites.stream()
                .map(favorite -> {
                    Product product = favorite.getProduct();
                    ProductDTO dto = new ProductDTO();
                    dto.setId(product.getId());
                    dto.setProductKey(product.getProductKey());
                    dto.setPrice(product.getPrice());
                    dto.setStock(product.getStock());
                    dto.setImagePath(product.getImagePath());
                    dto.setCategory(product.getCategory());

                    // Dil çevirisini ayarla
                    String productKey = product.getProductKey();

                    System.out.println("Looking for translation: productKey=" + productKey + ", language=" + language);
                    Optional<ProductTranslation> translation = translationRepository
                            .findByProductKeyAndLanguage(productKey, language);

                    if (translation.isPresent()) {
                        System.out.println("Translation found: " + translation.get().getTranslatedName());
                        dto.setTranslatedName(translation.get().getTranslatedName());
                    } else {
                        System.out.println("Translation not found, using productKey");
                        dto.setTranslatedName(product.getProductKey());
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Eskisi gibi Product sınıfını dönmesi gereken durumlarda
    public List<Product> getUserFavorites(Long userId) {
        System.out.println("Fetching favorites for userId: " + userId);
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        System.out.println("Found " + favorites.size() + " favorites for user");

        return favorites.stream().map(Favorite::getProduct).toList();
    }

    @Transactional
    public void toggleFavorite(Long userId, Long productId) {
        System.out.println("Toggle favorite for userId: " + userId + ", productId: " + productId);

        Optional<Favorite> existing = favoriteRepository.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            System.out.println("Removing favorite with id: " + existing.get().getId());
            favoriteRepository.delete(existing.get());
        } else {
            User user = userRepository.findById(userId).orElseThrow(() ->
                    new RuntimeException("Kullanıcı bulunamadı: " + userId));
            Product product = productRepository.findById(productId).orElseThrow(() ->
                    new RuntimeException("Ürün bulunamadı: " + productId));

            System.out.println("Adding new favorite for user: " + user.getEmail());
            Favorite favorite = new Favorite(user, product);
            favoriteRepository.save(favorite);
        }
    }
}