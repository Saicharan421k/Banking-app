package com.banking.backend.service;

import com.banking.backend.entity.BankAccount;
import com.banking.backend.entity.Customer;
import com.banking.backend.entity.User;
import com.banking.backend.repository.BankAccountRepository;
import com.banking.backend.repository.CustomerRepository;
import com.banking.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class AccountService {

    @Autowired
    private BankAccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public BankAccount createAccount(String username, String type, String mpin) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Check for existing accounts of the same type
        List<BankAccount> existingAccounts = accountRepository.findByCustomer(customer);
        long count = existingAccounts.stream().filter(a -> a.getType().equalsIgnoreCase(type)).count();
        if (count >= 1) {
            throw new RuntimeException("Limit reached: You can only have one " + type + " account. Contact support for more.");
        }

        BankAccount account = new BankAccount();
        account.setCustomer(customer);
        account.setAccountNumber(UUID.randomUUID().toString().substring(0, 10));
        account.setType(type);
        account.setBalance(BigDecimal.valueOf(1000));
        account.setStatus("ACTIVE");
        
        if (mpin != null && !mpin.isEmpty()) {
            account.setMpin(passwordEncoder.encode(mpin));
        }

        return accountRepository.save(account);
    }
    
    public void setMpin(Long accountId, String mpin) {
        BankAccount account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setMpin(passwordEncoder.encode(mpin));
        accountRepository.save(account);
    }

    public boolean verifyMpin(Long accountId, String mpin) {
        System.out.println("Verifying MPIN for Account ID: " + accountId);
        BankAccount account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (account.getMpin() == null) {
            System.out.println("MPIN verification failed: No MPIN set for account " + accountId);
            return false;
        }

        boolean match = passwordEncoder.matches(mpin, account.getMpin());
        System.out.println("MPIN match result: " + match);
        return match;
    }

    public void updateAccountStatus(Long accountId, String status) {
        BankAccount account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setStatus(status);
        accountRepository.save(account);
    }

    public void deleteAccount(Long accountId) {
        BankAccount account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        // Optional: Check balance before deleting? For now, allow force close.
        accountRepository.delete(account);
    }

    public List<BankAccount> getAccounts(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Customer customer = customerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return accountRepository.findByCustomer(customer);
    }
}
