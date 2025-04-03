package org.example.greengrocer.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;


@Service
public class RedisService {
    @Autowired
    private StringRedisTemplate redisTemplate;

    // Doğrulama kodunu Redis'e kaydet
    public void saveVerificationCode(String email, String code, long ttlInSeconds) {
        redisTemplate.opsForValue().set(email, code, ttlInSeconds, TimeUnit.SECONDS);
        String savedCode = redisTemplate.opsForValue().get(email);  // Redis'ten hemen alalım
        System.out.println("Saved verification code immediately after set: " + savedCode);
    }

    // Bu metod ile 2 dakika (120 saniye) TTL'yi belirleyebilirsiniz
    public void saveVerificationCodeWithTwoMinutes(String email, String code) {
        saveVerificationCode(email, code, 5 * 60); // 2 dakika = 2 * 60 saniye
    }

    public void saveEmail(String email) {
        // E-posta adresini Redis'e kaydetme
        redisTemplate.opsForValue().set("email", email, 10, TimeUnit.MINUTES);
        System.out.println("Email saved to Redis: " + email);
    }

    public String getEmail() {
        // Redis'teki doğrulama kodu ile ilişkili e-posta adresini almak
        // Burada kodu değil, e-posta adresini almak istiyoruz
        String email = redisTemplate.opsForValue().get("email"); // Burada "email" key'ini kullanıyoruz

        if (email != null) {
            // E-posta bulunduysa, e-posta adresini döndürüyoruz
            System.out.println("Found email: " + email);
            return email;
        } else {
            // Eğer veri Redis'ten bulunamazsa, null döner
            System.out.println("No email found in Redis.");
            return null;
        }
    }


    // Redis'ten doğrulama kodunu al
    public String getVerificationCode(String email) {
        String code = redisTemplate.opsForValue().get(email);
        System.out.println("Retrieved verification code from Redis for " + email + ": " + code);
        return code;
    }




    // Kodun süresinin dolup dolmadığını kontrol et
    public boolean isVerificationCodeExpired(String email) {
        long expireTime = redisTemplate.getExpire(email, TimeUnit.SECONDS);
        System.out.println("Redis expiration time for " + email + ": " + expireTime);
        return expireTime <= 0;
    }

    // Redis'teki e-posta anahtarını silme
    public void deleteEmailVerificationCode(String email) {
        redisTemplate.delete(email);
        System.out.println("Verification code for email " + email + " has been deleted from Redis.");
    }


}
