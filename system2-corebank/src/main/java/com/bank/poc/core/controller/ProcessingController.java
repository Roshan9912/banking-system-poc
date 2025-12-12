package com.bank.poc.core.controller;

import com.bank.poc.core.dto.TransactionRequest;
import com.bank.poc.core.entity.Card;
import com.bank.poc.core.entity.Transaction;
import com.bank.poc.core.service.CardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ProcessingController {

    private final CardService cardService;

    public ProcessingController(CardService cardService) {
        this.cardService = cardService;
    }

    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> process(@RequestBody TransactionRequest req) {
        String result = cardService.processTransaction(
                req.getCardNumber(),
                req.getPin(),
                req.getAmount(),
                req.getType()
        );
        Map<String, Object> resp = new HashMap<>();
        
        if (result.startsWith("SUCCESS")) {
            Card card = cardService.getCard(req.getCardNumber());
            resp.put("status", "SUCCESS");
            resp.put("message", "Transaction processed successfully");
            resp.put("newBalance", card != null ? card.getBalance() : 0);
            return ResponseEntity.ok(resp);
        } else {
            resp.put("status", "FAILED");
            resp.put("message", result);
            return ResponseEntity.badRequest().body(resp);
        }
    }

    @GetMapping("/balance/{cardNumber}")
    public Map<String, Object> balance(@PathVariable String cardNumber) {
        Card card = cardService.getCard(cardNumber);
        Map<String, Object> resp = new HashMap<>();
        if (card == null) {
            resp.put("exists", false);
        } else {
            resp.put("exists", true);
            resp.put("balance", card.getBalance());
            resp.put("customerName", card.getCustomerName());
            resp.put("cardNumber", card.getCardNumber());
        }
        return resp;
    }

    @GetMapping("/transactions/customer/{cardNumber}")
    public List<Transaction> customerTransactions(@PathVariable String cardNumber) {
        return cardService.getCustomerTransactions(cardNumber);
    }

    @GetMapping("/transactions/all")
    public List<Transaction> allTransactions() {
        return cardService.getAllTransactions();
    }
}

