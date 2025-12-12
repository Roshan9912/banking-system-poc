# 🏦 Banking System POC - Complete Implementation

A proof-of-concept banking system demonstrating modern full-stack development with secure transaction processing, role-based access control, and cryptographic PIN hashing.

## 📋 Project Overview

This project consists of **three interconnected systems**:

- **System 1 (Gateway API)**: Transaction entry point with validation and routing
- **System 2 (Core Banking)**: Card validation, PIN verification, and balance management
- **Banking UI (React Frontend)**: Customer and Admin dashboards with role-based access

### Key Features

✅ **Transaction Processing**: Withdraw and Top-up operations  
✅ **Card Routing**: Only cards starting with '4' (Visa simulation)  
✅ **PIN Security**: SHA-256 hashing (never stores plain-text PINs)  
✅ **Role-Based UI**: Customer and Super Admin dashboards  
✅ **Real-time Balance**: Live balance updates after transactions  
✅ **Transaction Logging**: Complete audit trail for all transactions  
✅ **In-Memory Database**: H2 for quick setup and testing  

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.3.0
- **Language**: Java 17
- **Database**: H2 (In-Memory)
- **Security**: Spring Security + SHA-256 hashing
- **API**: REST with JSON

### Frontend
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Routing**: React Router v7

### Build Tools
- **Maven**: Java dependency management
- **npm**: JavaScript package management

---

## 📦 Installation & Setup

### Prerequisites

- **Java 17+**: [Download here](https://adoptium.net/)
- **Node.js 18+**: [Download here](https://nodejs.org/)
- **Maven 3.8+**: [Download here](https://maven.apache.org/)
- **Git**: [Download here](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd banking-system-poc
```

### Step 2: Set Up System 2 (Core Banking) - Port 8082

```bash
cd system2-corebank

# Build the project
mvn clean package

# Run the application
mvn spring-boot:run
```

You should see:
```
✓ Initial cards seeded successfully
  Card 1: 4123456789012345 (PIN: 1234) - Balance: 10000.00
  Card 2: 4111111111111111 (PIN: 5678) - Balance: 5000.00
```

**H2 Console**: http://localhost:8082/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (leave blank)

### Step 3: Set Up System 1 (Gateway API) - Port 8081

```bash
cd system1-gateway

# Build the project
mvn clean package

# Run the application
mvn spring-boot:run
```

### Step 4: Set Up Banking UI - Port 3000

```bash
cd banking-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

Access the UI at: **http://localhost:3000**

---

## 🔐 Demo Credentials

### Customer Access
- **Username**: `cust1`
- **Password**: `pass`
- **Card**: `4123456789012345`
- **PIN**: `1234`
- **Initial Balance**: `$10,000.00`

### Admin Access
- **Username**: `admin`
- **Password**: `admin`

### Alternative Test Card
- **Card**: `4111111111111111`
- **PIN**: `5678`
- **Initial Balance**: `$5,000.00`

---

## 📡 API Documentation

### System 1: Gateway API (Port 8081)

#### Submit Transaction
```http
POST /api/transaction
Content-Type: application/json

{
  "cardNumber": "4123456789012345",
  "pin": "1234",
  "amount": 100.00,
  "type": "topup"
}
```

**Response (Success)**:
```json
{
  "status": "SUCCESS",
  "message": "Transaction processed successfully",
  "newBalance": 10100.00
}
```

**Response (Failed)**:
```json
{
  "status": "FAILED",
  "message": "Card range not supported"
}
```

### System 2: Core Banking API (Port 8082)

#### Get Balance
```http
GET /api/balance/{cardNumber}
```

**Response**:
```json
{
  "exists": true,
  "balance": 10000.00,
  "customerName": "John Doe",
  "cardNumber": "4123456789012345"
}
```

#### Get Customer Transactions
```http
GET /api/transactions/customer/{cardNumber}
```

**Response**:
```json
[
  {
    "id": 1,
    "cardNumber": "4123456789012345",
    "customerName": "John Doe",
    "type": "topup",
    "amount": 500.00,
    "timestamp": "2024-12-12T10:30:45",
    "status": "SUCCESS",
    "reason": "Transaction successful"
  }
]
```

#### Get All Transactions (Admin)
```http
GET /api/transactions/all
```

---

## 🧪 Testing with cURL

### Test 1: Valid Top-up Transaction

```bash
curl -X POST http://localhost:8081/api/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "cardNumber": "4123456789012345",
    "pin": "1234",
    "amount": 100.00,
    "type": "topup"
  }'
```

**Expected Output**:
```json
{
  "status": "SUCCESS",
  "message": "Transaction processed successfully",
  "newBalance": 10100.00
}
```

### Test 2: Invalid PIN

```bash
curl -X POST http://localhost:8081/api/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "cardNumber": "4123456789012345",
    "pin": "9999",
    "amount": 100.00,
    "type": "topup"
  }'
```

**Expected Output**:
```json
{
  "status": "FAILED",
  "message": "Invalid PIN"
}
```

### Test 3: Unsupported Card Range

```bash
curl -X POST http://localhost:8081/api/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "cardNumber": "5123456789012345",
    "pin": "1234",
    "amount": 100.00,
    "type": "topup"
  }'
```

**Expected Output**:
```json
{
  "status": "FAILED",
  "message": "Card range not supported"
}
```

### Test 4: Withdrawal (Insufficient Balance)

```bash
curl -X POST http://localhost:8081/api/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "cardNumber": "4123456789012345",
    "pin": "1234",
    "amount": 50000.00,
    "type": "withdraw"
  }'
```

**Expected Output**:
```json
{
  "status": "FAILED",
  "message": "Insufficient balance"
}
```

### Test 5: Check Customer Balance

```bash
curl -X GET http://localhost:8082/api/balance/4123456789012345
```

**Expected Output**:
```json
{
  "exists": true,
  "balance": 10100.00,
  "customerName": "John Doe",
  "cardNumber": "4123456789012345"
}
```

---

## 🎯 Project Structure

```
banking-system-poc/
├── system1-gateway/                    # Transaction Gateway
│   ├── src/main/java/.../gateway/
│   │   ├── controller/
│   │   │   └── TransactionController.java
│   │   ├── dto/
│   │   │   └── TransactionRequest.java
│   │   └── System1GatewayApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── system2-corebank/                   # Core Banking Engine
│   ├── src/main/java/.../core/
│   │   ├── entity/
│   │   │   ├── Card.java
│   │   │   └── Transaction.java
│   │   ├── repository/
│   │   │   ├── CardRepository.java
│   │   │   └── TransactionRepository.java
│   │   ├── service/
│   │   │   └── CardService.java
│   │   ├── controller/
│   │   │   └── ProcessingController.java
│   │   ├── config/
│   │   │   └── DataInitializer.java
│   │   └── CoreBankApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── banking-ui/                         # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Login.tsx
│   │   ├── pages/
│   │   │   ├── CustomerDashboard.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## 🔒 Security Implementation

### PIN Hashing
```java
// Never stores plain-text PINs
public String hashPin(String pin) {
    return DigestUtils.sha256Hex(pin);  // SHA-256 cryptographic hash
}

// Verification
boolean isValid = storedHash.equals(hashPin(inputPin));
```

### Card Routing
- ✅ Only cards starting with '4' are accepted
- ✅ Invalid card ranges rejected immediately at System 1
- ✅ Transaction logs include failed attempts

### Data Validation
- ✅ Card number required
- ✅ PIN required
- ✅ Amount must be > 0
- ✅ Type must be 'withdraw' or 'topup'

---

## 📊 Validation Test Cases

| Scenario | Card | PIN | Amount | Type | Expected Result |
|----------|------|-----|--------|------|-----------------|
| Valid Top-up | 4123... | 1234 | 100 | topup | ✅ SUCCESS |
| Invalid PIN | 4123... | 9999 | 100 | topup | ❌ Invalid PIN |
| Invalid Card | 5123... | 1234 | 100 | topup | ❌ Card range not supported |
| Insufficient Balance | 4123... | 1234 | 50000 | withdraw | ❌ Insufficient balance |
| Invalid Amount | 4123... | 1234 | -100 | topup | ❌ Amount must be > 0 |
| Missing PIN | 4123... | (empty) | 100 | topup | ❌ PIN is required |

---

## 🚀 Running the Complete System

### Terminal 1: Start System 2 (Core Banking)
```bash
cd system2-corebank
mvn spring-boot:run
```

### Terminal 2: Start System 1 (Gateway)
```bash
cd system1-gateway
mvn spring-boot:run
```

### Terminal 3: Start Frontend
```bash
cd banking-ui
npm run dev
```

### Terminal 4: Test with cURL (Optional)
```bash
# Run the test commands above
```

---

## 📈 Admin Dashboard Features

✅ **View All Transactions**: Complete audit trail across the system  
✅ **Real-time Statistics**:
- Total Transactions
- Successful vs Failed Count
- Total Withdrawals Amount
- Total Top-ups Amount

✅ **Refresh**: Manual refresh of transaction data  

---

## 👤 Customer Dashboard Features

✅ **View Balance**: Real-time account balance  
✅ **View Transactions**: Personal transaction history  
✅ **Top-up Functionality**: Add funds to account  
✅ **Transaction Details**: Date, type, amount, status, reason  

---

## 🔧 Building for Production

### Create Standalone JARs

```bash
# System 1
cd system1-gateway
mvn clean package -DskipTests
java -jar target/system1-gateway-0.0.1-SNAPSHOT.jar

# System 2
cd system2-corebank
mvn clean package -DskipTests
java -jar target/system2-corebank-0.0.1-SNAPSHOT.jar
```

### Build React for Production

```bash
cd banking-ui
npm run build
# Output in dist/
```

---

## 🐛 Troubleshooting

### Issue: "Connection refused" on port 8082
**Solution**: Ensure System 2 is running before System 1

### Issue: CORS errors in browser
**Solution**: Check that `@CrossOrigin(origins = "*")` is present in controllers

### Issue: PIN not hashing correctly
**Solution**: Ensure `commons-codec` dependency is in pom.xml

### Issue: Frontend won't connect to backend
**Solution**: Check all services are running on correct ports (8081, 8082, 3000)

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Material-UI Components](https://mui.com)
- [Maven Guide](https://maven.apache.org/guides/)
- [SHA-256 Hashing Best Practices](https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet)

---

## 👨‍💼 Authors & Contributors

- **Developer**: [Your Name]
- **Date**: December 2024
- **Version**: 1.0.0

---

## 📝 License

This project is open-source and available for educational purposes.

---

## ✨ Future Enhancements

- [ ] Add two-factor authentication (2FA)
- [ ] Implement JWT token-based authentication
- [ ] Add transaction search and filtering
- [ ] Generate PDF statements
- [ ] Multi-currency support
- [ ] Rate limiting and fraud detection
- [ ] Mobile app (React Native)
- [ ] Database persistence (PostgreSQL/MySQL)
- [ ] Scheduled backup system
- [ ] Analytics and reporting

---

## 🤝 Support

For issues or questions, please create a GitHub issue or contact the development team.

**Happy Banking! 🚀**

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
