import api, { ApiResponse, PaginatedResponse } from './api';

export interface Transaction {
  id: string;
  userId: string;
  subBudgetId?: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  notes?: string;
  date: string;
  transactionDate: string;
  tags: string[];
  merchant?: string;
  location?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  subBudget?: {
    id: string;
    name: string;
    category: string;
    color: string;
    icon: string;
  };
}

export interface CreateTransactionData {
  subBudgetId?: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  notes?: string;
  date?: string;
  tags?: string[];
  merchant?: string;
  location?: string;
}

export interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE';
  subBudgetId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export const transactionService = {
  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    const response = await api.post<ApiResponse<Transaction>>('/transactions', data);
    return response.data.data!;
  },

  async getTransactions(
    filters?: TransactionFilters,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Transaction>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Transaction>>>('/transactions', {
      params: { ...filters, page, pageSize },
    });
    return response.data.data!;
  },

  async getTransactionById(id: string): Promise<Transaction> {
    const response = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return response.data.data!;
  },

  async getTransactionStats(startDate?: string, endDate?: string): Promise<TransactionStats> {
    const response = await api.get<ApiResponse<TransactionStats>>('/transactions/stats', {
      params: { startDate, endDate },
    });
    return response.data.data!;
  },

  async updateTransaction(id: string, data: Partial<CreateTransactionData>): Promise<Transaction> {
    const response = await api.patch<ApiResponse<Transaction>>(`/transactions/${id}`, data);
    return response.data.data!;
  },

  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};
