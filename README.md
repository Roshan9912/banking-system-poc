# Banking System POC

## Overview

This is a Proof-of-Concept implementation of a simplified banking system demonstrating two-tier transaction processing, card validation, and role-based transaction monitoring with SHA-256 PIN hashing.

## Quick Start

### Prerequisites
- JDK 17+
- Node.js 18+
- Maven

### Build
```bash
cd system2-corebank && ./mvnw clean package
cd ../system1-gateway && ./mvnw clean package
cd ../banking-ui && npm install
```

### Run

**Terminal 1 - System 2 (Core Banking on port 8082):**
```bash
cd system2-corebank
java -jar target/system2-corebank-0.0.1-SNAPSHOT.jar
```

**Terminal 2 - System 1 (Gateway on port 8081):**
```bash
cd system1-gateway
java -jar target/system1-gateway-0.0.1-SNAPSHOT.jar
```

**Terminal 3 - React UI (on port 5173):**
```bash
cd banking-ui
npm run dev
```

## Test Endpoints

### Withdrawal
```bash
curl -X POST http://localhost:8082/api/process \
  -H "Content-Type: application/json" \
  -d '{"cardNumber":"4123456789012345","pin":"1234","amount":50.0,"type":"withdraw"}'
```

Response: `{"result":"SUCCESS: Transaction successful"}`

### Top-up
```bash
curl -X POST http://localhost:8082/api/process \
  -H "Content-Type: application/json" \
  -d '{"cardNumber":"4123456789012345","pin":"1234","amount":100.0,"type":"topup"}'
```

Response: `{"result":"SUCCESS: Transaction successful"}`

### Check Balance
```bash
curl http://localhost:8082/api/balance/4123456789012345
```

Response: `{"balance":950.0,"exists":true,"customerName":"John Doe"}`

### View Transaction History
```bash
curl http://localhost:8082/api/transactions/customer/4123456789012345
curl http://localhost:8082/api/transactions/all
```

## Default Test Card
- **Card Number:** 4123456789012345
- **PIN:** 1234
- **Initial Balance:** $1000
- **Customer:** John Doe

## System Architecture

| Component | Port | Purpose |
|-----------|------|---------|
| System 1 Gateway | 8081 | Transaction entry & routing |
| System 2 Core Bank | 8082 | Card validation & processing |
| React UI | 5173 | Customer & Admin dashboards |
| H2 Console | 8082/h2-console | Database admin |

## Key Features

✅ SHA-256 PIN Hashing (never plain-text)  
✅ Card Range Validation (4xxx Visa-like cards only)  
✅ Transaction Processing (withdraw/topup)  
✅ Role-Based Dashboards (Customer/Admin)  
✅ H2 In-Memory Database  
✅ REST APIs with CORS  
✅ Transaction Logging & Audit Trail  
✅ Secure PIN Verification  

## Test Results Summary

| Test Case | Status | Details |
|-----------|--------|---------|
| Valid Withdrawal | ✅ PASS | Deducts amount, logs transaction |
| Valid Top-up | ✅ PASS | Adds amount, logs transaction |
| Check Balance | ✅ PASS | Returns correct balance |
| Transaction History | ✅ PASS | Retrieves all customer transactions |
| Invalid PIN | ✅ PASS | Correctly rejected |
| Insufficient Balance | ✅ PASS | Correctly rejected |
| Card Not Found | ✅ PASS | Correctly rejected |
| Card Range Validation | ✅ PASS | Only 4xxx accepted |

## Project Structure

```
banking-system-poc/
├── system1-gateway/                    # Transaction Gateway
│   ├── src/main/java/com/bank/poc/gateway/
│   │   ├── controller/TransactionController.java
│   │   ├── dto/TransactionRequest.java
│   │   ├── config/SecurityConfig.java
│   │   └── System1GatewayApplication.java
│   └── pom.xml
│
├── system2-corebank/                   # Core Banking Engine
│   ├── src/main/java/com/bank/poc/core/
│   │   ├── controller/ProcessingController.java
│   │   ├── entity/Card.java
│   │   ├── entity/Transaction.java
│   │   ├── repository/CardRepository.java
│   │   ├── repository/TransactionRepository.java
│   │   ├── service/CardService.java
│   │   ├── dto/TransactionRequest.java
│   │   ├── config/SecurityConfig.java
│   │   └── CoreBankApplication.java
│   └── pom.xml
│
└── banking-ui/                         # React Frontend
    ├── src/
    │   ├── components/Login.tsx
    │   ├── pages/CustomerDashboard.tsx
    │   ├── pages/AdminDashboard.tsx
    │   ├── services/api.ts
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 4.0, Spring Security, Hibernate JPA |
| Database | H2 In-Memory |
| Frontend | React 18, TypeScript, Vite, Axios |
| Build | Maven, npm |
| Security | SHA-256 Hashing, Spring Security |

## Security Practices

- **PIN Hashing:** SHA-256 hashing - never stored as plain text
- **Authentication:** PIN verification against hashed values
- **Authorization:** Role-based access (Customer/Admin)
- **CORS:** Enabled for frontend integration
- **Input Validation:** Comprehensive validation at System 1 gateway
- **Card Range Validation:** Only Visa-like cards (4xxx) accepted

## Database Access

H2 Web Console: `http://localhost:8082/h2-console`

**Credentials:**
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (leave blank)

## Future Enhancements

- JWT-based authentication
- HTTPS/TLS encryption
- Persistent database (PostgreSQL)
- Advanced fraud detection
- Rate limiting
- Payment gateway integration
- Mobile app support
- Comprehensive logging & monitoring

---

**Version:** 1.0.0-POC  
**Last Updated:** December 12, 2025
