package com.banking.backend.controller;

import com.banking.backend.entity.Transaction;
import com.banking.backend.repository.TransactionRepository;
import com.banking.backend.repository.BankAccountRepository;
import com.banking.backend.service.StatementService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/statements")
public class StatementController {

    @Autowired
    private StatementService statementService;

    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private BankAccountRepository bankAccountRepository;

    @GetMapping("/{accountId}/download")
    public void downloadStatement(
            @PathVariable Long accountId,
            @RequestParam(defaultValue = "pdf") String format,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            HttpServletResponse response
    ) throws IOException {
        
        var account = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Basic date filtering logic (default to last 30 days if null)
        LocalDateTime start = (startDate != null) ? startDate.atStartOfDay() : LocalDateTime.now().minusDays(30);
        LocalDateTime end = (endDate != null) ? endDate.atTime(23, 59, 59) : LocalDateTime.now();

        List<Transaction> transactions = transactionRepository.findByAccountInOrderByTimestampDesc(java.util.Collections.singletonList(account)); 
        // Note: Real impl should use a query with Between dates, filtering in-memory for MVP
        List<Transaction> filtered = transactions.stream()
                .filter(t -> !t.getTimestamp().isBefore(start) && !t.getTimestamp().isAfter(end))
                .toList();
        
        response.setContentType(format.equals("pdf") ? "application/pdf" : "text/csv");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=statement_" + accountId + "_" + start.toLocalDate() + "." + format;
        response.setHeader(headerKey, headerValue);

        if (format.equals("pdf")) {
            statementService.exportToPdf(filtered, response.getOutputStream());
        } else {
            statementService.exportToCsv(filtered, response.getWriter());
        }
    }
}
