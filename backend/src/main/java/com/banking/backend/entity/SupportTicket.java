package com.banking.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets")
@Data
@NoArgsConstructor
public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String ticketId; // UUID

    private Long userId; // Nullable (for pre-login)
    
    private String email; // Required for pre-login

    @Column(nullable = false)
    private String issueType; // LOGIN, TRANSACTION, OTHER

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String status; // OPEN, RESOLVED

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "OPEN";
    }
}
