import api from './api';

export const transactionService = {
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    budgetId?: string;
    subBudgetId?: string;
  }) {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  async createTransaction(data: {
    description: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    date: string;
    subBudgetId: string;
    notes?: string;
  }) {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  async updateTransaction(id: string, data: any) {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  async deleteTransaction(id: string) {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  async getStatistics(budgetId: string) {
    const response = await api.get(`/transactions/stats/${budgetId}`);
    return response.data;
  },
};
