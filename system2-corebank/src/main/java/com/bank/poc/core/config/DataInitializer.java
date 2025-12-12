package com.bank.poc.core.config;

import com.bank.poc.core.entity.Card;
import com.bank.poc.core.repository.CardRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(CardRepository cardRepository) {
        return args -> {
            // Seed initial card data
            String pinHash = DigestUtils.sha256Hex("1234");
            
            Card card1 = new Card();
            card1.setCardNumber("4123456789012345");
            card1.setPinHash(pinHash);
            card1.setBalance(10000.00);
            card1.setCustomerName("John Doe");
            card1.setCustomerEmail("john.doe@example.com");
            
            Card card2 = new Card();
            card2.setCardNumber("4111111111111111");
            card2.setPinHash(DigestUtils.sha256Hex("5678"));
            card2.setBalance(5000.00);
            card2.setCustomerName("Jane Smith");
            card2.setCustomerEmail("jane.smith@example.com");
            
            cardRepository.save(card1);
            cardRepository.save(card2);
            
            System.out.println("✓ Initial cards seeded successfully");
            System.out.println("  Card 1: 4123456789012345 (PIN: 1234) - Balance: 10000.00");
            System.out.println("  Card 2: 4111111111111111 (PIN: 5678) - Balance: 5000.00");
        };
    }
}
