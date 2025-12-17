package com.banking.backend.controller;

import com.banking.backend.dto.Dtos;
import com.banking.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Dtos.AccountStatusRequest request) {
        adminService.updateUserStatus(id, request.getStatus());
        return ResponseEntity.ok("User status updated");
    }

    @PostMapping("/accounts/credit")
    public ResponseEntity<?> manualCredit(@RequestBody Dtos.CreditDebitRequest request, java.security.Principal principal) {
        adminService.manualCredit(request, principal.getName());
        return ResponseEntity.ok("Account credited successfully");
    }

    @PostMapping("/accounts/debit")
    public ResponseEntity<?> manualDebit(@RequestBody Dtos.CreditDebitRequest request, java.security.Principal principal) {
        adminService.manualDebit(request, principal.getName());
        return ResponseEntity.ok("Account debited successfully");
    }

    @PutMapping("/accounts/{id}/status")
    public ResponseEntity<?> updateAccountStatus(@PathVariable Long id, @RequestBody Dtos.AccountStatusRequest request) {
        adminService.updateAccountStatus(id, request.getStatus());
        return ResponseEntity.ok("Account status updated");
    }

    @GetMapping("/accounts")
    public ResponseEntity<?> getAllAccounts() {
        return ResponseEntity.ok(adminService.getAllAccounts());
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getAllTransactions() {
        return ResponseEntity.ok(adminService.getAllTransactions());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }
}
