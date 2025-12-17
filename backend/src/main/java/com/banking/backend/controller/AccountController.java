package com.banking.backend.controller;

import com.banking.backend.dto.Dtos;
import com.banking.backend.service.AccountService;
import com.banking.backend.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/banking")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private TransferService transferService;

    @PostMapping("/accounts")
    public ResponseEntity<?> createAccount(@RequestBody Dtos.CreateAccountRequest request, Principal principal) {
        System.out.println("Received createAccount request for user: " + principal.getName());
        return ResponseEntity.ok(accountService.createAccount(principal.getName(), request.getType(), request.getMpin()));
    }

    @GetMapping("/accounts")
    public ResponseEntity<?> getAccounts(Principal principal) {
        // ... (as before)
        return ResponseEntity.ok(accountService.getAccounts(principal.getName()));
    }
    
    @PostMapping("/accounts/set-mpin")
    public ResponseEntity<?> setAccountMpin(@RequestBody Dtos.MpinRequest request, Principal principal) {
        // In real app, verify ownership here
        accountService.setMpin(request.getAccountId(), request.getMpin());
        return ResponseEntity.ok("MPIN set successfully");
    }

    @PostMapping("/verify-mpin")
    public ResponseEntity<?> verifyMpin(@RequestBody Dtos.MpinRequest request) {
        boolean valid = accountService.verifyMpin(request.getAccountId(), request.getMpin());
        if (valid) return ResponseEntity.ok("Valid MPIN");
        return ResponseEntity.status(401).body("Invalid MPIN");
    }

    @PutMapping("/accounts/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Dtos.AccountStatusRequest request) {
        accountService.updateAccountStatus(id, request.getStatus());
        return ResponseEntity.ok("Account status updated");
    }

    @DeleteMapping("/accounts/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok("Account deleted successfully");
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody Dtos.TransferRequest request, Principal principal) {
        transferService.transfer(principal.getName(), request);
        return ResponseEntity.ok("Transfer successful");
    }

    @GetMapping("/transactions/recent")
    public ResponseEntity<?> getRecentTransactions(Principal principal) {
        return ResponseEntity.ok(transferService.getRecentTransactions(principal.getName()));
    }

    @GetMapping("/transactions/{accountNumber}")
    public ResponseEntity<?> getTransactions(@PathVariable String accountNumber, Principal principal) {
        return ResponseEntity.ok(transferService.getTransactions(accountNumber, principal.getName()));
    }
}
