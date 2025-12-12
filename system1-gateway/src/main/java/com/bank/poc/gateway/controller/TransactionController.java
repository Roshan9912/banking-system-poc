package com.bank.poc.gateway.controller;

import com.bank.poc.gateway.dto.TransactionRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TransactionController {

    private static final String SYSTEM2_URL = "http://localhost:8082/api/process";

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/transaction")
    public ResponseEntity<Map<String, Object>> handleTransaction(@RequestBody TransactionRequest req) {
        Map<String, Object> resp = new HashMap<>();

        // Validation: cardNumber
        if (req.getCardNumber() == null || req.getCardNumber().trim().isEmpty()) {
            resp.put("status", "FAILED");
            resp.put("message", "Card number is required");
            return ResponseEntity.badRequest().body(resp);
        }

        // Validation: pin
        if (req.getPin() == null || req.getPin().trim().isEmpty()) {
            resp.put("status", "FAILED");
            resp.put("message", "PIN is required");
            return ResponseEntity.badRequest().body(resp);
        }

        // Validation: amount > 0
        if (req.getAmount() == null || req.getAmount() <= 0) {
            resp.put("status", "FAILED");
            resp.put("message", "Amount must be greater than 0");
            return ResponseEntity.badRequest().body(resp);
        }

        // Validation: type is withdraw or topup
        if (req.getType() == null || req.getType().trim().isEmpty()) {
            resp.put("status", "FAILED");
            resp.put("message", "Transaction type is required");
            return ResponseEntity.badRequest().body(resp);
        }

        if (!req.getType().equalsIgnoreCase("withdraw") && !req.getType().equalsIgnoreCase("topup")) {
            resp.put("status", "FAILED");
            resp.put("message", "Transaction type must be 'withdraw' or 'topup'");
            return ResponseEntity.badRequest().body(resp);
        }

        // Routing Logic: Only cards starting with '4'
        if (!req.getCardNumber().startsWith("4")) {
            resp.put("status", "FAILED");
            resp.put("message", "Card range not supported");
            return ResponseEntity.ok(resp);
        }

        // Forward to System 2
        try {
            Map<String, Object> system2Resp = restTemplate.postForObject(SYSTEM2_URL, req, Map.class);
            return ResponseEntity.ok(system2Resp);
        } catch (Exception e) {
            resp.put("status", "FAILED");
            resp.put("message", "System 2 processing error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(resp);
        }
    }
}

