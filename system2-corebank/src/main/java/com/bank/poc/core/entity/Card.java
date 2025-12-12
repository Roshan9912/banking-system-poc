package com.bank.poc.core.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Card {
    @Id
    private String cardNumber;
    private String pinHash;
    private double balance;
    private String customerName;
}
