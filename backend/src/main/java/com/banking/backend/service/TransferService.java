package com.banking.backend.service;

import com.banking.backend.dto.Dtos;
import com.banking.backend.entity.BankAccount;
import com.banking.backend.entity.Transaction;
import com.banking.backend.repository.BankAccountRepository;
import com.banking.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransferService {

    @Autowired
    private BankAccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private com.banking.backend.repository.UserRepository userRepository;

    @Autowired
    private com.banking.backend.repository.CustomerRepository customerRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Transactional
    public void transfer(String username, Dtos.TransferRequest request) {
        BankAccount from = accountRepository.findByAccountNumber(request.getFromAccount())
                .orElseThrow(() -> new RuntimeException("Source account not found"));
        
        // Verify ownership
        if (!from.getCustomer().getUser().getUsername().equals(username)) {
             throw new RuntimeException("Unauthorized transfer attempt");
        }

        // Verify MPIN
        if (from.getMpin() == null || !passwordEncoder.matches(request.getMpin(), from.getMpin())) {
            throw new RuntimeException("Invalid MPIN");
        }
        
        BankAccount to = accountRepository.findByAccountNumber(request.getToAccount())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        // Check Account Status
        if ("BLOCKED".equalsIgnoreCase(from.getStatus())) {
            throw new RuntimeException("Account is BLOCKED. Contact Admin.");
        }
        if ("BLOCKED".equalsIgnoreCase(to.getStatus())) {
            throw new RuntimeException("Target Account is BLOCKED. Transfer failed.");
        }

        if (from.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        from.setBalance(from.getBalance().subtract(request.getAmount()));
        to.setBalance(to.getBalance().add(request.getAmount()));

        accountRepository.save(from);
        accountRepository.save(to);

        Transaction debit = new Transaction();
        debit.setAccount(from);
        debit.setType("DEBIT");
        debit.setAmount(request.getAmount());
        debit.setDescription("Transfer to " + to.getAccountNumber());
        transactionRepository.save(debit);

        Transaction credit = new Transaction();
        credit.setAccount(to);
        credit.setType("CREDIT");
        credit.setAmount(request.getAmount());
        credit.setDescription("Transfer from " + from.getAccountNumber());
        transactionRepository.save(credit);
    }
    
    public List<Transaction> getTransactions(String accountNumber, String username) {
         BankAccount account = accountRepository.findByAccountNumber(accountNumber)
                 .orElseThrow(() -> new RuntimeException("Account not found"));
         
         if (!account.getCustomer().getUser().getUsername().equals(username)) {
             throw new RuntimeException("Unauthorized access");
         }
         
         return transactionRepository.findByAccount(account);
    }

    public List<Transaction> getRecentTransactions(String username) {
        com.banking.backend.entity.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        com.banking.backend.entity.Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        List<BankAccount> accounts = accountRepository.findByCustomer(customer);
        if (accounts.isEmpty()) {
            System.out.println("getRecentTransactions: No accounts found for " + username);
            return java.util.Collections.emptyList();
        }
        List<Transaction> txs = transactionRepository.findByAccountInOrderByTimestampDesc(accounts);
        System.out.println("getRecentTransactions: Found " + txs.size() + " transactions for " + accounts.size() + " accounts.");
        return txs;
    }
}
