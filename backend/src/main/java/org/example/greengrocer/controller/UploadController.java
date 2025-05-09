package org.example.greengrocer.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@CrossOrigin(origins = "http://localhost:3000")  // frontend portunu yaz
public class UploadController {

    @PostMapping("/api/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // ⛳ Klasörü tanımla
            String uploadDir = new File("target/classes/static/assets").getAbsolutePath();

            // ❗ Klasör yoksa oluştur
            File uploadDirFile = new File(uploadDir);
            if (!uploadDirFile.exists()) {
                uploadDirFile.mkdirs();
            }

            // 🕒 Dosya adını oluştur
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String uniqueFilename = timestamp + extension;

            // 📂 Kaydet
            File saveFile = new File(uploadDir, uniqueFilename);
            file.transferTo(saveFile);

            // 🌐 Geri dönecek path
            String filePath = "http://localhost:8080/assets/" + uniqueFilename;

            Map<String, String> response = new HashMap<>();
            response.put("filePath", filePath);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Upload failed"));
        }
    }





}
