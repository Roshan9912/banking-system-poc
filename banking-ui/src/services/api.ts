import axios from "axios";
import {
  TransactionRequest,
  TransactionResponse,
  BalanceResponse,
  Transaction,
} from "../types";

const API_BASE_URL = "http://localhost:8081/api";
const SYSTEM2_BASE_URL = "http://localhost:8082/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Transaction APIs
export const submitTransaction = async (
  transaction: TransactionRequest
): Promise<TransactionResponse> => {
  const response = await axiosInstance.post<TransactionResponse>(
    "/transaction",
    transaction
  );
  return response.data;
};

// Card & Balance APIs
export const getBalance = async (
  cardNumber: string
): Promise<BalanceResponse> => {
  const response = await axios.get<BalanceResponse>(
    `${SYSTEM2_BASE_URL}/balance/${cardNumber}`
  );
  return response.data;
};

// Transaction History APIs
export const getCustomerTransactions = async (
  cardNumber: string
): Promise<Transaction[]> => {
  const response = await axios.get<Transaction[]>(
    `${SYSTEM2_BASE_URL}/transactions/customer/${cardNumber}`
  );
  return response.data;
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get<Transaction[]>(
    `${SYSTEM2_BASE_URL}/transactions/all`
  );
  return response.data;
};

export default axiosInstance;
