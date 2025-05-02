package org.example.greengrocer.service;

import org.example.greengrocer.model.ProductTranslation;
import org.example.greengrocer.repository.ProductTranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;


import java.util.List;
import java.util.Optional;

@Service
public class ProductTranslationService {

    private final ProductTranslationRepository translationRepository;

    @Autowired
    public ProductTranslationService(ProductTranslationRepository translationRepository) {
        this.translationRepository = translationRepository;
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


    // ------------------ MyMemory API Entegrasyonu ------------------ //

    public String autoTranslate(String text, String targetLang) {

        String langCode = targetLang.equalsIgnoreCase("tr") ? "tr" : targetLang;

        String url = "https://api.mymemory.translated.net/get"
                + "?q=" + text.replace(" ", "%20")
                + "&langpair=en|" + langCode;

        System.out.println("ÇEVİRİ API ÇAĞRISI: " + url);  // LOG

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

                translatedText = URLDecoder.decode(translatedText, StandardCharsets.UTF_8);

                translatedText = capitalizeWords(translatedText);

                System.out.println("ÇEVİRİ LOGU (decode edilmiş): '" + text + "' -> [" + langCode + "] -> " + translatedText);
                return translatedText;
            }
        }

        return capitalizeWords(text);
    }


    public static class TranslationResponse {
        public ResponseData responseData;

        public static class ResponseData {
            public String translatedText;
        }
    }
}
