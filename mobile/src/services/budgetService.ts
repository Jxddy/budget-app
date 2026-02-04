import api from './api';

export const budgetService = {
  async getBudgets(params?: { page?: number; limit?: number }) {
    const response = await api.get('/budgets', { params });
    return response.data;
  },

  async getActiveBudget() {
    const response = await api.get('/budgets/active');
    return response.data;
  },

  async getBudgetSummary(budgetId: string) {
    const response = await api.get(`/budgets/${budgetId}/summary`);
    return response.data;
  },

  async createBudget(data: {
    name: string;
    amount: number;
    month: number;
    year: number;
  }) {
    const response = await api.post('/budgets', data);
    return response.data;
  },

  async updateBudget(id: string, data: any) {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  async deleteBudget(id: string) {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};
