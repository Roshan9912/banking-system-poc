package com.bank.poc.core.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Transaction {

    @Id
    @GeneratedValue
    private Long id;

    private String cardNumber;
    private String type;
    private double amount;
    private LocalDateTime timestamp;
    private String status;
    private String reason;
}
