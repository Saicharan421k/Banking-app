package com.banking.backend.controller;

import com.banking.backend.dto.Dtos;
import com.banking.backend.entity.SupportTicket;
import com.banking.backend.entity.User;
import com.banking.backend.repository.SupportTicketRepository;
import com.banking.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class SupportController {

    @Autowired
    private SupportTicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    // Public Endpoint (Pre-login)
    @PostMapping("/public/support")
    public ResponseEntity<?> createPublicTicket(@RequestBody Dtos.SupportRequest request) {
        SupportTicket ticket = new SupportTicket();
        ticket.setTicketId(UUID.randomUUID().toString());
        ticket.setEmail(request.getEmail());
        ticket.setIssueType(request.getIssueType());
        ticket.setDescription(request.getDescription());
        ticket.setStatus("OPEN");
        
        ticketRepository.save(ticket);
        return ResponseEntity.ok(ticket);
    }

    // Authenticated Endpoint (Post-login)
    @PostMapping("/support")
    public ResponseEntity<?> createUserTicket(@RequestBody Dtos.SupportRequest request, java.security.Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SupportTicket ticket = new SupportTicket();
        ticket.setTicketId(UUID.randomUUID().toString());
        ticket.setUserId(user.getId());
        ticket.setIssueType(request.getIssueType());
        ticket.setDescription(request.getDescription());
        ticket.setStatus("OPEN");
        // Try to get email from user profile if not provided? Skipping for now.

        ticketRepository.save(ticket);
        return ResponseEntity.ok(ticket);
    }

    @GetMapping("/support/my-tickets")
    public ResponseEntity<List<SupportTicket>> getUserTickets(java.security.Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(ticketRepository.findByUserId(user.getId()));
    }

    // Admin Endpoints
    @GetMapping("/admin/support")
    public ResponseEntity<List<SupportTicket>> getAllTickets() {
        return ResponseEntity.ok(ticketRepository.findAll());
    }

    @PutMapping("/admin/support/{id}/resolve")
    public ResponseEntity<?> resolveTicket(@PathVariable Long id) {
        SupportTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus("RESOLVED");
        ticketRepository.save(ticket);
        return ResponseEntity.ok("Ticket resolved");
    }
}
