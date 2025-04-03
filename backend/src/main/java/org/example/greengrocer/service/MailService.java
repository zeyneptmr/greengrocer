package org.example.greengrocer.service;

import com.google.gson.Gson;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.example.greengrocer.repository.UserRepository;
import org.example.greengrocer.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@Service
public class MailService {
    private static final String API_KEY = "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";
    private static final String API_URL = "https://api.sendinblue.com/v3/smtp/email";

    @Autowired
    private UserRepository userRepository;

    public String sendVerificationCode(String userEmail) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            System.out.println("Error: Email cannot be null or empty.");
            return null;
        }

        userEmail = userEmail.trim();
        System.out.println("Checking if email exists in the database: '" + userEmail + "'");

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(userEmail);

        if (userOpt.isEmpty()) {
            System.out.println("Email not found in database.");
            System.out.println("Existing emails in DB:");
            userRepository.findAll().forEach(user -> System.out.println("'" + user.getEmail() + "'"));
            return null;
        }

        System.out.println("User found: " + userOpt.get().getEmail());

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            Map<String, Object> emailData = new HashMap<>();
            emailData.put("sender", Map.of("email", "taptazee@gmail.com", "name", "Your Name"));
            emailData.put("to", new Object[]{Map.of("email", userEmail)});
            emailData.put("subject", "Password Reset Verification Code");

            String verificationCode = generateVerificationCode();
            emailData.put("htmlContent", "<html><body><h1>Your verification code is: " + verificationCode + "</h1></body></html>");

            Gson gson = new Gson();
            System.out.println("Prepared email data: " + gson.toJson(emailData));

            HttpPost httpPost = new HttpPost(API_URL);
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setHeader("api-key", API_KEY);
            httpPost.setEntity(new StringEntity(gson.toJson(emailData)));

            System.out.println("Sending POST request to SendinBlue API...");

            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                HttpEntity entity = response.getEntity();
                String responseString = EntityUtils.toString(entity);

                System.out.println("Response Status Code: " + response.getStatusLine().getStatusCode());
                System.out.println("Response Body: " + responseString);

                if (response.getStatusLine().getStatusCode() == 201) {
                    System.out.println("Verification code sent successfully!");
                    return verificationCode;
                } else {
                    System.out.println("Error sending email: " + responseString);
                    return null;
                }
            }
        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private String generateVerificationCode() {
        return String.format("%06d", (int) (Math.random() * 1000000));
    }
}