export interface User {
  id: string;
  username: string;
  role: "CUSTOMER" | "ADMIN";
  cardNumber?: string;
  customerName?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TransactionRequest {
  cardNumber: string;
  pin: string;
  amount: number;
  type: "withdraw" | "topup";
}

export interface Transaction {
  id: number;
  cardNumber: string;
  customerName: string;
  type: "withdraw" | "topup";
  amount: number;
  timestamp: string;
  status: "SUCCESS" | "FAILED";
  reason: string;
}

export interface Card {
  cardNumber: string;
  balance: number;
  customerName: string;
  customerEmail: string;
}

export interface BalanceResponse {
  exists: boolean;
  balance: number;
  customerName: string;
  cardNumber: string;
}

export interface TransactionResponse {
  status: "SUCCESS" | "FAILED";
  message: string;
  newBalance?: number;
}
