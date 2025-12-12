#!/bin/bash

# Banking System POC - Quick Start Script
# This script builds and runs all three services

set -e

echo "🏦 Banking System POC - Quick Start"
echo "===================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_java() {
    if ! command -v java &> /dev/null; then
        echo -e "${RED}✗ Java is not installed. Please install Java 17 or higher.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Java found${NC}"
}

check_maven() {
    if ! command -v mvn &> /dev/null; then
        echo -e "${RED}✗ Maven is not installed. Please install Maven.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Maven found${NC}"
}

check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}✗ Node.js is not installed. Please install Node.js 18 or higher.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js found${NC}"
}

echo "Checking prerequisites..."
check_java
check_maven
check_node

echo ""
echo "Building System 2 (Core Banking)..."
cd system2-corebank
mvn clean package -DskipTests -q
cd ..
echo -e "${GREEN}✓ System 2 built successfully${NC}"

echo ""
echo "Building System 1 (Gateway)..."
cd system1-gateway
mvn clean package -DskipTests -q
cd ..
echo -e "${GREEN}✓ System 1 built successfully${NC}"

echo ""
echo "Installing React dependencies..."
cd banking-ui
npm install --silent
cd ..
echo -e "${GREEN}✓ React dependencies installed${NC}"

echo ""
echo -e "${GREEN}✓✓✓ Build Complete! ✓✓✓${NC}"
echo ""
echo "To start the systems, open three terminals and run:"
echo ""
echo -e "${YELLOW}Terminal 1 - Core Banking (Port 8082):${NC}"
echo "cd system2-corebank && mvn spring-boot:run"
echo ""
echo -e "${YELLOW}Terminal 2 - Transaction Gateway (Port 8081):${NC}"
echo "cd system1-gateway && mvn spring-boot:run"
echo ""
echo -e "${YELLOW}Terminal 3 - React Frontend (Port 3000):${NC}"
echo "cd banking-ui && npm run dev"
echo ""
echo "Then access the UI at: http://localhost:3000"
echo ""
echo -e "${GREEN}Demo Credentials:${NC}"
echo "  Customer: cust1 / pass"
echo "  Admin: admin / admin"
echo "  Card: 4123456789012345 | PIN: 1234"
echo ""
