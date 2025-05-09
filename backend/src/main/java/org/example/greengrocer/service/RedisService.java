package org.example.greengrocer.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;


@Service
public class RedisService {
    @Autowired
    private StringRedisTemplate redisTemplate;


    public void saveVerificationCode(String email, String code, long ttlInSeconds) {
        redisTemplate.opsForValue().set(email, code, ttlInSeconds, TimeUnit.SECONDS);
        String savedCode = redisTemplate.opsForValue().get(email);  
        System.out.println("Saved verification code immediately after set: " + savedCode);
    }

    
    public void saveVerificationCodeWithTwoMinutes(String email, String code) {
        saveVerificationCode(email, code, 5 * 60); 
    }

    public void saveEmail(String email) {
        
        redisTemplate.opsForValue().set("email", email, 10, TimeUnit.MINUTES);
        System.out.println("Email saved to Redis: " + email);
    }

    public String getEmail() {
        
    
        String email = redisTemplate.opsForValue().get("email"); 

        if (email != null) {
        
            System.out.println("Found email: " + email);
            return email;
        } else {
        
            System.out.println("No email found in Redis.");
            return null;
        }
    }


    
    public String getVerificationCode(String email) {
        String code = redisTemplate.opsForValue().get(email);
        System.out.println("Retrieved verification code from Redis for " + email + ": " + code);
        return code;
    }



    public boolean isVerificationCodeExpired(String email) {
        long expireTime = redisTemplate.getExpire(email, TimeUnit.SECONDS);
        System.out.println("Redis expiration time for " + email + ": " + expireTime);
        return expireTime <= 0;
    }


    public void deleteEmailVerificationCode(String email) {
        redisTemplate.delete(email);
        System.out.println("Verification code for email " + email + " has been deleted from Redis.");
    }


}
