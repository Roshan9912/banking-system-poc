package com.bank.poc.core.service;

import com.bank.poc.core.entity.Card;
import com.bank.poc.core.entity.Transaction;
import com.bank.poc.core.repository.CardRepository;
import com.bank.poc.core.repository.TransactionRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CardService {

    private final CardRepository cardRepository;
    private final TransactionRepository transactionRepository;

    public CardService(CardRepository cardRepository, TransactionRepository transactionRepository) {
        this.cardRepository = cardRepository;
        this.transactionRepository = transactionRepository;
    }

    public String hashPin(String pin) {
    return DigestUtils.sha256Hex(pin);
}

    public String processTransaction(String cardNumber, String pin, double amount, String type) {
        Optional<Card> cardOpt = cardRepository.findByCardNumber(cardNumber);
        if (cardOpt.isEmpty()) {
            saveTransaction(cardNumber, type, amount, "FAILED", "Invalid card");
            return "FAILED: Invalid card";
        }

        Card card = cardOpt.get();

        if (!hashPin(pin).equals(card.getPinHash())) {
            saveTransaction(cardNumber, type, amount, "FAILED", "Invalid PIN");
            return "FAILED: Invalid PIN";
        }

        if ("withdraw".equalsIgnoreCase(type)) {
            if (card.getBalance() < amount) {
                saveTransaction(cardNumber, type, amount, "FAILED", "Insufficient balance");
                return "FAILED: Insufficient balance";
            }
            card.setBalance(card.getBalance() - amount);
        } else if ("topup".equalsIgnoreCase(type)) {
            card.setBalance(card.getBalance() + amount);
        } else {
            saveTransaction(cardNumber, type, amount, "FAILED", "Invalid transaction type");
            return "FAILED: Invalid transaction type";
        }

        cardRepository.save(card);
        saveTransaction(cardNumber, type, amount, "SUCCESS", "Transaction successful");
        return "SUCCESS: Transaction successful";
    }

    private void saveTransaction(String cardNumber, String type, double amount,
                                 String status, String reason) {
        Transaction transaction = new Transaction();
        transaction.setCardNumber(cardNumber);
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setStatus(status);
        transaction.setReason(reason);
        transactionRepository.save(transaction);
    }

    public Card getCard(String cardNumber) {
        return cardRepository.findByCardNumber(cardNumber).orElse(null);
    }

    public List<Transaction> getCustomerTransactions(String cardNumber) {
        return transactionRepository.findByCardNumberOrderByTimestampDesc(cardNumber);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByTimestampDesc();
    }
}
