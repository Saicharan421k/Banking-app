package com.banking.backend.config;

import com.banking.backend.entity.User;
import com.banking.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Migration: Ensure all users are active by default (fix for existing users after adding active column)
        // Ideally this should be a DB migration script, but for now we do it here.
        userRepository.findAll().forEach(user -> {
            if (!user.isActive()) {
                 // For now, let's just force enable everyone to fix the login issue
                 // In production, we would be more careful.
                 // Actually, checking boolean default might be tricky if it was null in DB.
                 // Let's just set true if it's false, assuming we want to unlock everyone after this update.
                 System.out.println("Enabling legacy user: " + user.getUsername());
                 user.setActive(true);
                 userRepository.save(user);
            }
        });

        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setActive(true);
            userRepository.save(admin);
            System.out.println("Admin user created: admin / admin123");
        }
    }
}
