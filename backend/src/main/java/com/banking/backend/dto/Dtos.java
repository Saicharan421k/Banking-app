package com.banking.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

public class Dtos {
    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String username;
        private String password;
        private String name;
        private String email;
        private String phone;
        private String securityQuestion;
        private String securityAnswer;
    }

    @Data
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    public static class VerifySecurityRequest {
        private String username;
        private String securityAnswer;
        private String newPassword;
    }

    @Data
    public static class MpinRequest {
        private String username;
        private Long accountId; // New field for Account-specific MPIN
        private String mpin;
    }

    @Data
    public static class CreateAccountRequest {
        private String type;
        private String mpin;
    }

    @Data
    public static class TransferRequest {
        private String fromAccount;
        private String toAccount;
        private BigDecimal amount;
        private String mpin; // For verification
    }

    @Data
    public static class ProfileResponse {
        private String username;
        private String name;
        private String email;
        private String phone;
        private String role;
    }

    @Data
    public static class UpdateProfileRequest {
        private String email;
        private String phone;
    }

    @Data
    public static class UpdateSecurityRequest {
        private String password;
        private String securityQuestion;
        private String securityAnswer;
    }

    @Data
    public static class AccountStatusRequest {
        private String status;
    }

    @Data
    public static class AdminUserDTO {
        private Long id;
        private String username;
        private String name;
        private String email;
        private String phone;
        private String role;
        private boolean active; // Derived from status or isAccountNonLocked
    }

    @Data
    public static class SupportRequest {
        private String email; // For non-login
        private String issueType;
        private String description;
    }

    @Data
    public static class CreditDebitRequest {
        private String accountNumber;
        private BigDecimal amount;
    }

    @Data
    public static class AdminStatsDTO {
        private long totalUsers;
        private BigDecimal totalBalance;
        private long todayTransactions;
    }
}
