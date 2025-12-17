package com.banking.backend.service;

import com.banking.backend.dto.Dtos;
import com.banking.backend.entity.BankAccount;
import com.banking.backend.entity.Customer;
import com.banking.backend.entity.User;
import com.banking.backend.repository.BankAccountRepository;
import com.banking.backend.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransferServiceTest {

    @Mock
    private BankAccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private TransferService transferService;

    private BankAccount sourceAccount;
    private BankAccount destAccount;
    private User user;
    private Customer customer;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUsername("testuser");

        customer = new Customer();
        customer.setUser(user);

        sourceAccount = new BankAccount();
        sourceAccount.setId(1L);
        sourceAccount.setAccountNumber("1234567890");
        sourceAccount.setBalance(new BigDecimal("1000.00"));
        sourceAccount.setMpin("encodedMpin");
        sourceAccount.setCustomer(customer);
        sourceAccount.setStatus("ACTIVE");

        destAccount = new BankAccount();
        destAccount.setId(2L);
        destAccount.setAccountNumber("0987654321");
        destAccount.setBalance(new BigDecimal("500.00"));
        destAccount.setStatus("ACTIVE");
    }

    @Test
    void transfer_Success() {
        Dtos.TransferRequest request = new Dtos.TransferRequest();
        request.setFromAccount("1234567890");
        request.setToAccount("0987654321");
        request.setAmount(new BigDecimal("100.00"));
        request.setMpin("1234");

        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findByAccountNumber("0987654321")).thenReturn(Optional.of(destAccount));
        when(passwordEncoder.matches("1234", "encodedMpin")).thenReturn(true);

        transferService.transfer("testuser", request);

        assertEquals(new BigDecimal("900.00"), sourceAccount.getBalance());
        assertEquals(new BigDecimal("600.00"), destAccount.getBalance());
        verify(transactionRepository, times(2)).save(any());
        verify(accountRepository, times(2)).save(any(BankAccount.class));
    }

    @Test
    void transfer_InsufficientFunds() {
        Dtos.TransferRequest request = new Dtos.TransferRequest();
        request.setFromAccount("1234567890");
        request.setToAccount("0987654321");
        request.setAmount(new BigDecimal("2000.00")); // More than balance
        request.setMpin("1234");

        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findByAccountNumber("0987654321")).thenReturn(Optional.of(destAccount));
        when(passwordEncoder.matches("1234", "encodedMpin")).thenReturn(true);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            transferService.transfer("testuser", request);
        });

        assertEquals("Insufficient funds", exception.getMessage());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void transfer_InvalidMpin() {
        Dtos.TransferRequest request = new Dtos.TransferRequest();
        request.setFromAccount("1234567890");
        request.setToAccount("0987654321");
        request.setAmount(new BigDecimal("100.00"));
        request.setMpin("wrong");

        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.of(sourceAccount));
        when(passwordEncoder.matches("wrong", "encodedMpin")).thenReturn(false);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            transferService.transfer("testuser", request);
        });

        assertEquals("Invalid MPIN", exception.getMessage());
    }

    @Test
    void transfer_SourceAccountNotFound() {
        Dtos.TransferRequest request = new Dtos.TransferRequest();
        request.setFromAccount("1234567890");

        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            transferService.transfer("testuser", request);
        });

        assertEquals("Source account not found", exception.getMessage());
    }

    @Test
    void transfer_DestinationAccountNotFound() {
        Dtos.TransferRequest request = new Dtos.TransferRequest();
        request.setFromAccount("1234567890");
        request.setToAccount("9999999999");
        request.setMpin("1234");

        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findByAccountNumber("9999999999")).thenReturn(Optional.empty());
        when(passwordEncoder.matches("1234", "encodedMpin")).thenReturn(true);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            transferService.transfer("testuser", request);
        });

        assertEquals("Destination account not found", exception.getMessage());
    }

    @Test
    void transfer_UnauthorizedSource() {
        Dtos.TransferRequest request = new Dtos.TransferRequest();
        request.setFromAccount("1234567890");

        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.of(sourceAccount));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            transferService.transfer("hacker", request); // Different user
        });

        assertEquals("Unauthorized transfer attempt", exception.getMessage());
    }

    @Test
    void transfer_BlockedSourceAccount() {
        sourceAccount.setStatus("BLOCKED");
        Dtos.TransferRequest request = new Dtos.TransferRequest();
        request.setFromAccount("1234567890");
        request.setToAccount("0987654321");
        request.setMpin("1234");

        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findByAccountNumber("0987654321")).thenReturn(Optional.of(destAccount));
        when(passwordEncoder.matches("1234", "encodedMpin")).thenReturn(true);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            transferService.transfer("testuser", request);
        });

        assertEquals("Account is BLOCKED. Contact Admin.", exception.getMessage());
    }

    @Test
    void transfer_BlockedDestinationAccount() {
        destAccount.setStatus("BLOCKED");
        Dtos.TransferRequest request = new Dtos.TransferRequest();
        request.setFromAccount("1234567890");
        request.setToAccount("0987654321");
        request.setAmount(new BigDecimal("100.00"));
        request.setMpin("1234");
        
        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findByAccountNumber("0987654321")).thenReturn(Optional.of(destAccount));
        when(passwordEncoder.matches("1234", "encodedMpin")).thenReturn(true);


        Exception exception = assertThrows(RuntimeException.class, () -> {
            transferService.transfer("testuser", request);
        });

        assertEquals("Target Account is BLOCKED. Transfer failed.", exception.getMessage());
    }
}
