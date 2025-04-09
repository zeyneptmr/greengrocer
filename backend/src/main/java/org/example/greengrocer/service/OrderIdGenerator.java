package org.example.greengrocer.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Random;

public class OrderIdGenerator {
    public static String generateOrderId() {
        String date = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE); // yyyyMMdd
        int random = new Random().nextInt(900000) + 100000;
        return "TAP-" + date + "-" + random;
    }
}
