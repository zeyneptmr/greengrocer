package org.example.greengrocer.serialization;  // Projenizin uygun paketine göre değiştirin

import java.io.IOException;

import org.springframework.security.core.GrantedAuthority;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class GrantedAuthoritySerializer extends JsonSerializer<GrantedAuthority> {
    @Override
    public void serialize(GrantedAuthority authority, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        // GrantedAuthority'nin yetkisini (ROLE_ vs. vb.) string olarak yazdırıyoruz
        gen.writeString(authority.getAuthority());
    }
}
