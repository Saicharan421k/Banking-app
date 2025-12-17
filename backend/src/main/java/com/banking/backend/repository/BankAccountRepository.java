package com.banking.backend.repository;

import com.banking.backend.entity.BankAccount;
import com.banking.backend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    Optional<BankAccount> findByAccountNumber(String accountNumber);
    List<BankAccount> findByCustomer(Customer customer);
}
