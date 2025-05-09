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
@CrossOrigin(origins = "http://localhost:3000")
public class UploadController {

    @PostMapping("/api/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String runtimePath = new File("target/classes/static/assets").getAbsolutePath();
            String resourcePath = new File("src/main/resources/static/assets").getAbsolutePath();

            new File(runtimePath).mkdirs();
            new File(resourcePath).mkdirs();

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String uniqueFilename = timestamp + extension;

            byte[] bytes = file.getBytes();

            File runtimeFile = new File(runtimePath, uniqueFilename);
            File resourceFile = new File(resourcePath, uniqueFilename);

            org.apache.commons.io.FileUtils.writeByteArrayToFile(runtimeFile, bytes);
            org.apache.commons.io.FileUtils.writeByteArrayToFile(resourceFile, bytes);

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
