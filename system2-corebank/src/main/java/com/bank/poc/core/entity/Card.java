package com.bank.poc.core.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Card {
    @Id
    private String cardNumber;
    private String pinHash;
    private double balance;
    private String customerName;
    private String customerEmail;

    // Constructors
    public Card() {}

    public Card(String cardNumber, String pinHash, double balance, String customerName, String customerEmail) {
        this.cardNumber = cardNumber;
        this.pinHash = pinHash;
        this.balance = balance;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
    }

    // Getters
    public String getCardNumber() {
        return cardNumber;
    }

    public String getPinHash() {
        return pinHash;
    }

    public double getBalance() {
        return balance;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    // Setters
    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public void setPinHash(String pinHash) {
        this.pinHash = pinHash;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
}
