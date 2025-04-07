package com.example.greengrocer.serialization;  // Projenizin uygun paketine göre değiştirin

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.springframework.security.core.GrantedAuthority;

import java.io.IOException;

public class GrantedAuthoritySerializer extends JsonSerializer<GrantedAuthority> {
    @Override
    public void serialize(GrantedAuthority authority, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        // GrantedAuthority'nin yetkisini (ROLE_ vs. vb.) string olarak yazdırıyoruz
        gen.writeString(authority.getAuthority());
    }
}
