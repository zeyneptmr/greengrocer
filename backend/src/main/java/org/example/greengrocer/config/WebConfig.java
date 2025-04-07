package com.example.greengrocer.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Tüm API'ler için CORS açma
                .allowedOrigins("http://localhost:3000") // React uygulamanızın adresi
                .allowedMethods("GET", "POST", "PUT", "DELETE") // İzin verilen HTTP yöntemleri
                .allowedHeaders("*"); // İzin verilen başlıklar
    }
}
