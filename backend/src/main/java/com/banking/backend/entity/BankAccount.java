package com.banking.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "bank_accounts")
@Data
@NoArgsConstructor
public class BankAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private String type; // SAVINGS, CURRENT

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false)
    private String status; // ACTIVE, BLOCKED

    private String mpin;
}
