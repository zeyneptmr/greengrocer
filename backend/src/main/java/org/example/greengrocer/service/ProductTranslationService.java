package org.example.greengrocer.service;

import com.github.pemistahl.lingua.api.*;

import org.example.greengrocer.model.ProductTranslation;
import org.example.greengrocer.repository.ProductTranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import jakarta.annotation.PostConstruct;


import java.util.List;
import java.util.Optional;

@Service
public class ProductTranslationService {

    private final ProductTranslationRepository translationRepository;
    private LanguageDetector languageDetector;

    @Autowired
    public ProductTranslationService(ProductTranslationRepository translationRepository) {
        this.translationRepository = translationRepository;
    }

    @PostConstruct
    public void initLanguageDetector() {
        languageDetector = LanguageDetectorBuilder.fromLanguages(
                Language.ENGLISH,
                Language.TURKISH
        ).build();
    }


    public String detectLanguage(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "en"; 
        }
        Language detectedLanguage = languageDetector.detectLanguageOf(text);
        String langCode = detectedLanguage.getIsoCode639_1().toString().toLowerCase();
        System.out.println("Algılanan Dil: " + langCode);  
        return langCode; 
    }




    public String autoTranslate(String text, String sourceLang, String targetLang) {

        System.out.println("autoTranslate fonksiyonuna girildi");

        if (sourceLang.equals(targetLang)) {
            System.out.println("Kaynak ve hedef dil aynı (" + sourceLang + "), çeviri yapılmayacak: " + text);
            return capitalizeWords(text);
        }

        try {
            String query = text + " ürün adı";

            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);

            String url = "https://api.mymemory.translated.net/get"
                    + "?q=" + encodedQuery
                    + "&langpair=" + sourceLang + "|" + targetLang;

            System.out.println("ÇEVİRİ API ÇAĞRISI: " + url);

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<TranslationResponse> responseEntity =
                    restTemplate.exchange(url, HttpMethod.GET, entity, TranslationResponse.class);

            TranslationResponse response = responseEntity.getBody();

            if (response != null && response.responseData != null) {
                String translatedText = response.responseData.translatedText;

                if (translatedText != null) {

                    if (translatedText.contains("%")) {
                        translatedText = URLDecoder.decode(translatedText, StandardCharsets.UTF_8);
                    }

                    translatedText = translatedText.replaceAll("%20", " ");

                    translatedText = translatedText.replaceAll("(?i)ürün adı", "").trim();

                    translatedText = translatedText.toLowerCase();
                    translatedText = capitalizeWords(translatedText);

                    System.out.println("ÇEVİRİ LOGU: '" + text + "' -> [" + targetLang + "] -> " + translatedText);
                    return translatedText;
                }
            }

        } catch (Exception e) {
            System.out.println("Çeviri sırasında hata oluştu: " + e.getMessage());
        }

        return capitalizeWords(text);
    }



    public static class TranslationResponse {
        public ResponseData responseData;

        public static class ResponseData {
            public String translatedText;
        }
    }



    public Optional<ProductTranslation> getTranslation(String productKey, String language) {
        return translationRepository.findByProductKeyAndLanguage(productKey, language);
    }

    public List<ProductTranslation> getAllTranslations(String language) {
        return translationRepository.findByLanguage(language);
    }

    public ProductTranslation saveTranslation(ProductTranslation translation) {
        return translationRepository.save(translation);
    }

    private String capitalizeWords(String str) {
        String[] words = str.split(" ");
        StringBuilder capitalized = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                capitalized.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1))
                        .append(" ");
            }
        }
        return capitalized.toString().trim();
    }

    public List<ProductTranslation> searchByTranslatedName(String translatedName, String language) {
        return translationRepository.findByTranslatedNameContainingIgnoreCaseAndLanguage(translatedName, language);
    }







}
