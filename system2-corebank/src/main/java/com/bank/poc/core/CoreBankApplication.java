package com.bank.poc.core;

import com.bank.poc.core.entity.Card;
import com.bank.poc.core.repository.CardRepository;
import com.bank.poc.core.service.CardService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CoreBankApplication {

    public static void main(String[] args) {
        SpringApplication.run(CoreBankApplication.class, args);
    }

    @Bean
    CommandLineRunner init(CardRepository cardRepository, CardService cardService) {
        return args -> {
            if (cardRepository.findByCardNumber("4123456789012345").isEmpty()) {
                Card card = new Card();
                card.setCardNumber("4123456789012345");
                card.setPinHash(cardService.hashPin("1234"));
                card.setBalance(1000.00);
                card.setCustomerName("John Doe");
                cardRepository.save(card);
            }
        };
    }
}
