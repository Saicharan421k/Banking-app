package com.banking.backend.service;

import com.banking.backend.dto.Dtos;
import com.banking.backend.entity.Customer;
import com.banking.backend.entity.User;
import com.banking.backend.repository.CustomerRepository;
import com.banking.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public User registerCustomer(Dtos.RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("CUSTOMER");
        user = userRepository.save(user);

        Customer customer = new Customer();
        customer.setUser(user);
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setSecurityQuestion(request.getSecurityQuestion());
        // Hash the security answer just like a password
        customer.setSecurityAnswer(passwordEncoder.encode(request.getSecurityAnswer()));
        
        customerRepository.save(customer);

        return user;
    }

    public String getSecurityQuestion(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return customer.getSecurityQuestion();
    }

    public void resetPassword(String username, String answer, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (!passwordEncoder.matches(answer, customer.getSecurityAnswer())) {
            throw new RuntimeException("Incorrect Security Answer");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public Dtos.ProfileResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Dtos.ProfileResponse response = new Dtos.ProfileResponse();
        response.setUsername(user.getUsername());
        response.setRole(user.getRole());

        // For Admin, Customer profile might not exist
        customerRepository.findByUser(user).ifPresentOrElse(customer -> {
            response.setName(customer.getName());
            response.setEmail(customer.getEmail());
            response.setPhone(customer.getPhone());
        }, () -> {
            response.setName("Administrator");
            response.setEmail("admin@system.local");
            response.setPhone("N/A");
        });
        
        return response;
    }

    public void updateProfile(String username, Dtos.UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (request.getEmail() != null) customer.setEmail(request.getEmail());
        if (request.getPhone() != null) customer.setPhone(request.getPhone());
        
        customerRepository.save(customer);
    }

    public void updateSecuritySettings(String username, Dtos.UpdateSecurityRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // Verify current password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect Password");
        }

        customer.setSecurityQuestion(request.getSecurityQuestion());
        customer.setSecurityAnswer(passwordEncoder.encode(request.getSecurityAnswer()));
        
        customerRepository.save(customer);
    }
}
