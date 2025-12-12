package com.bank.poc.core.repository;

import com.bank.poc.core.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, String> {
    Optional<Card> findByCardNumber(String cardNumber);
}
