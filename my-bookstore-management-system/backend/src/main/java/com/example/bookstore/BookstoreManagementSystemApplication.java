package com.example.bookstore;

import com.example.bookstore.model.User;
import com.example.bookstore.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BookstoreManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookstoreManagementSystemApplication.class, args);
    }

    @Bean
    public CommandLineRunner bootstrapAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("password"));
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
                System.out.println("Bootstrap admin created for admin@example.com");
            }
            if (userRepository.findByEmail("user@example.com").isEmpty()) {
                User user = new User();
                user.setName("Regular User");
                user.setEmail("user@example.com");
                user.setPassword(passwordEncoder.encode("password"));
                user.setRole("ROLE_USER");
                userRepository.save(user);
                System.out.println("Bootstrap user created for user@example.com");
            }
        };
    }
}
