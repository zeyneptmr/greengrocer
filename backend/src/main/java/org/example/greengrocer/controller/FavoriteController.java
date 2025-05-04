package org.example.greengrocer.controller;

import java.util.List;
import java.util.Map;

import org.example.greengrocer.dto.ProductDTO;
import org.example.greengrocer.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getFavorites(

        HttpServletRequest request,
        @RequestParam(defaultValue = "en") String language) {
        try {
        System.out.println("Fetching favorites with language: " + language);
        Long userId = favoriteService.getUserIdFromRequest(request);
        List<ProductDTO> favorites = favoriteService.getUserFavoritesWithTranslation(userId, language);
        System.out.println("Favorites retrieved count: " + favorites.size());
        // Alınan çevirileri kontrol et
        favorites.forEach(p -> System.out.println("Product: " + p.getProductKey() + ", Translation: " + p.getTranslatedName()));
        return ResponseEntity.ok(favorites);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
}

    @PostMapping("/{productId}")
    public ResponseEntity<Void> toggleFavorite(HttpServletRequest request, @PathVariable Long productId) {
        try {
            Long userId = favoriteService.getUserIdFromRequest(request);
            favoriteService.toggleFavorite(userId, productId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}