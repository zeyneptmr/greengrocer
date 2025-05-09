package org.example.greengrocer.serialization;

import java.io.IOException;

import org.springframework.security.core.GrantedAuthority;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class GrantedAuthoritySerializer extends JsonSerializer<GrantedAuthority> {
    @Override
    public void serialize(GrantedAuthority authority, JsonGenerator gen, SerializerProvider serializers) throws IOException {

        gen.writeString(authority.getAuthority());
    }
}
