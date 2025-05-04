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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;


@Service
public class MailService {
    private static final Logger logger = LoggerFactory.getLogger(MailService.class);
    private static final String API_KEY = "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";
    private static final String API_URL = "https://api.sendinblue.com/v3/smtp/email";

    @Autowired
    private UserRepository userRepository;

    public String sendVerificationCode(String userEmail) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            logger.error("Error: Email cannot be null or empty.");
            return null;
        }

        userEmail = userEmail.trim();
        logger.info("Checking if email exists in the database: '{}'", userEmail);

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(userEmail);

        if (userOpt.isEmpty()) {
            logger.warn("Email not found in database.");
            logger.info("Existing emails in DB:");
            userRepository.findAll().forEach(user -> System.out.println("'" + user.getEmail() + "'"));
            return null;
        }

        logger.info("User found: {}", userOpt.get().getEmail());

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            Map<String, Object> emailData = new HashMap<>();
            emailData.put("sender", Map.of(
                    "email", "taptazee@gmail.com",
                    "name", "TAPTAZE"
            ));

            emailData.put("to", new Object[]{Map.of("email", userEmail)});
            //emailData.put("subject", "Reset your password");

            String verificationCode = generateVerificationCode();

            emailData.put("subject", "Your TapTaze verification code is " +  verificationCode);

            String htmlContent = """
                <html>
                  <head>
                    <style>
                      .container {
                        max-width: 600px;
                        margin: auto;
                        padding: 20px;
                        border-radius: 10px;
                        background-color: #f9fdf9;
                        border: 2px solid #e0f2e9;
                        font-family: Arial, sans-serif;
                        color: #333;
                      }
            
                       .logo {
                         background-color: #ffffff;
                         padding: 10px;
                         text-align: left;
                         border-radius: 10px;
                       }
            
                      .code-box {
                        background-color: #dfffe0;
                        color: #1a7f32;
                        font-weight: bold;
                        font-size: 24px;
                        padding: 15px;
                        margin: 20px 0;
                        text-align: center;
                        border-radius: 10px;
                        border: 2px dashed #2bb54c;
                      }
            
                      a:hover {
                        color: #f97316;
                      }
            
                      .image-box {
                        text-align: center;
                        margin-top: 30px;
                      }
            
                      .image-box img {
                        width: 100%%;
                        max-width: 100%%;
                        height: auto;
                        aspect-ratio: 3 / 1;
                        object-fit: cover;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                      }

                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="logo">
                        <img src="https://i.imgur.com/4ofG4rH.jpg" alt="Tap-Taze Logo" style="width: 120px;" />
                      </div>
            
                      <p>Dear Customer,</p>
                      <p>We noticed a request to reset your password or verify your account on <strong>TapTaze</strong>.</p>
                      <p>If this was you, use the verification code below:</p>
            
                      <div class="code-box">%s</div>
            
                      <p>If you did not request this, you can ignore this message safely.</p>
                      <p>Need help? Visit our <a href="https://taptaze.com/help">Help Center</a>.</p>
            
                      <p style="margin-top: 30px;">Best regards,<br/>Taptaze Team</p>
            
                      <div class="image-box">
                        <img
                          src="https://i.imgur.com/qN1cQab.jpeg" 
                          alt="Greengrocer Market"
                        />
                      </div>
                    </div>
                  </body>
                </html>
            """.formatted(verificationCode);


            emailData.put("htmlContent", htmlContent);


            Gson gson = new Gson();
            System.out.println("Prepared email data: " + gson.toJson(emailData));

            HttpPost httpPost = new HttpPost(API_URL);
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setHeader("api-key", API_KEY);
            httpPost.setEntity(new StringEntity(gson.toJson(emailData)));

            logger.info("Sending POST request to SendinBlue API...");

            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                HttpEntity entity = response.getEntity();
                String responseString = EntityUtils.toString(entity);

                logger.info("Response Status Code: {}", response.getStatusLine().getStatusCode());
                logger.info("Response Body: {}", responseString);

                if (response.getStatusLine().getStatusCode() == 201) {
                    logger.info("Verification code sent successfully!");
                    return verificationCode;
                } else {
                    logger.error("Error sending email: {}", responseString);
                    return null;
                }
            }
        } catch (Exception e) {
            logger.error("Exception occurred: {}", e.getMessage(), e);
            e.printStackTrace();
            return null;
        }
    }

    private String generateVerificationCode() {
        return String.format("%06d", (int) (Math.random() * 1000000));
    }
}