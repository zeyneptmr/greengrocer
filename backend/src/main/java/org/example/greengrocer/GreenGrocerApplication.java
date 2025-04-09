package org.example.greengrocer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GreenGrocerApplication {

	public static void main(String[] args) {
		SpringApplication.run(GreenGrocerApplication.class, args);
	}

}
