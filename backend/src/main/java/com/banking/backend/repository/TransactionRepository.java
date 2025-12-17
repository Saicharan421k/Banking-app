package com.banking.backend.repository;

import com.banking.backend.entity.BankAccount;
import com.banking.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccount(BankAccount account);
    List<Transaction> findByAccountInOrderByTimestampDesc(List<BankAccount> accounts);
    List<Transaction> findByAccountAndTimestampBetween(BankAccount account, LocalDateTime start, LocalDateTime end);
}
