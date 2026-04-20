package com.smartcampus.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController // Adds web capabilities
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @GetMapping("/hello") // Maps this method to http://localhost:8080/hello
    public String sayHello() {
        return "Smart Campus Backend is running!";
    }
	 @GetMapping("/he") // Maps this method to http://localhost:8080/hello
    public String sayHe() {
        return "heeeddff!";
    }
}