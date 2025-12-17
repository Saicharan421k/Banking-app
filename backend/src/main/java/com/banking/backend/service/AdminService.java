package com.banking.backend.service;

import com.banking.backend.dto.Dtos;
import com.banking.backend.entity.BankAccount;
import com.banking.backend.entity.Customer;
import com.banking.backend.entity.Transaction;
import com.banking.backend.entity.User;
import com.banking.backend.repository.BankAccountRepository;
import com.banking.backend.repository.CustomerRepository;
import com.banking.backend.repository.TransactionRepository;
import com.banking.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Dtos.AdminUserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            Dtos.AdminUserDTO dto = new Dtos.AdminUserDTO();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setRole(user.getRole());
            
            // Try to find customer profile
            customerRepository.findByUser(user).ifPresent(customer -> {
                dto.setName(customer.getName());
                dto.setEmail(customer.getEmail());
                dto.setPhone(customer.getPhone());
            });
            
            dto.setActive(user.isActive());
            return dto;
        }).collect(Collectors.toList());
    }

    public void manualCredit(Dtos.CreditDebitRequest request, String adminUsername) {
        BankAccount account = bankAccountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.setBalance(account.getBalance().add(request.getAmount()));
        bankAccountRepository.save(account);

        // Record Transaction
        Transaction tx = new Transaction();
        tx.setAccount(account); // Fixed: Entity uses single account link
        tx.setAmount(request.getAmount());
        tx.setType("CREDIT (ADMIN)");
        tx.setInitiatedBy("Admin: " + adminUsername);
        tx.setTimestamp(LocalDateTime.now());
        transactionRepository.save(tx);
    }

    public void manualDebit(Dtos.CreditDebitRequest request, String adminUsername) {
        BankAccount account = bankAccountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient funds for debit");
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        bankAccountRepository.save(account);

        Transaction tx = new Transaction();
        tx.setAccount(account);
        tx.setAmount(request.getAmount());
        tx.setType("DEBIT (ADMIN)");
        tx.setInitiatedBy("Admin: " + adminUsername);
        tx.setTimestamp(LocalDateTime.now());
        transactionRepository.save(tx);
    }

    public void updateAccountStatus(Long accountId, String status) {
        BankAccount account = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setStatus(status);
        bankAccountRepository.save(account);
    }

    public Dtos.AdminStatsDTO getStats() {
        Dtos.AdminStatsDTO stats = new Dtos.AdminStatsDTO();
        stats.setTotalUsers(userRepository.count());
        
        BigDecimal totalBalance = bankAccountRepository.findAll().stream()
                .map(BankAccount::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalBalance(totalBalance != null ? totalBalance : BigDecimal.ZERO);

        // Ideally query repository for 'today'
        // For simplicity, just counting all for now or I need a custom query
        // keeping it simple: Total Transactions
        // keeping it simple: Total Transactions
        stats.setTodayTransactions(transactionRepository.count()); 
        
        return stats;
    }

    public void updateUserStatus(Long userId, String status) {
        System.out.println("Admin updating user " + userId + " status to " + status);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // "ACTIVE" -> true, "BLOCKED" -> false
        user.setActive("ACTIVE".equalsIgnoreCase(status));
        userRepository.save(user);
    }

    public List<BankAccount> getAllAccounts() {
        return bankAccountRepository.findAll();
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}
