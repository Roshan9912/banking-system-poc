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
    public ResponseEntity<Map<String, String>> handle(@RequestBody TransactionRequest req) {
        Map<String, String> resp = new HashMap<>();

        if (req.getCardNumber() == null || req.getPin() == null
                || req.getAmount() == null || req.getAmount() <= 0
                || req.getType() == null
                || !(req.getType().equalsIgnoreCase("withdraw")
                     || req.getType().equalsIgnoreCase("topup"))) {
            resp.put("result", "FAILED: Invalid input parameters");
            return ResponseEntity.badRequest().body(resp);
        }

        if (!req.getCardNumber().startsWith("4")) {
            resp.put("result", "FAILED: Card range not supported");
            return ResponseEntity.status(HttpStatus.OK).body(resp);
        }

        Map<String, Object> body = new HashMap<>();
        body.put("cardNumber", req.getCardNumber());
        body.put("pin", req.getPin());
        body.put("amount", req.getAmount());
        body.put("type", req.getType());

        Map<?, ?> system2Resp = restTemplate.postForObject(SYSTEM2_URL, body, Map.class);
        resp.put("result", system2Resp != null ? system2Resp.get("result").toString()
                                               : "FAILED: Unknown error");
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}
