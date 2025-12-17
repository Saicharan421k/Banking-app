package com.banking.backend.repository;

import com.banking.backend.entity.Customer;
import com.banking.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    java.util.List<Customer> findByEmail(String email);
    Optional<Customer> findByUser(User user);
}
