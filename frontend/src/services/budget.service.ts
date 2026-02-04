import api, { ApiResponse } from './api';

export interface Budget {
  id: string;
  name: string;
  description?: string;
  month: number;
  year: number;
  totalAmount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubBudget {
  id: string;
  budgetId: string;
  name: string;
  description?: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
  icon: string;
  alertThreshold: number;
  percentageUsed?: number;
  transactionCount?: number;
}

export interface BudgetSummary {
  budget: Budget;
  totalSpent: number;
  totalTarget: number;
  remaining: number;
  percentageUsed: number;
  subBudgets: SubBudget[];
}

export interface CreateBudgetData {
  name: string;
  description?: string;
  month: number;
  year: number;
  totalAmount: number;
}

export const budgetService = {
  async createBudget(data: CreateBudgetData): Promise<Budget> {
    const response = await api.post<ApiResponse<Budget>>('/budgets', data);
    return response.data.data!;
  },

  async getBudgets(includeArchived = false): Promise<Budget[]> {
    const response = await api.get<ApiResponse<Budget[]>>('/budgets', {
      params: { includeArchived },
    });
    return response.data.data!;
  },

  async getActiveBudget(): Promise<BudgetSummary | null> {
    const response = await api.get<ApiResponse<BudgetSummary>>('/budgets/active');
    return response.data.data!;
  },

  async getBudgetById(id: string): Promise<Budget> {
    const response = await api.get<ApiResponse<Budget>>(`/budgets/${id}`);
    return response.data.data!;
  },

  async getBudgetSummary(id: string): Promise<BudgetSummary> {
    const response = await api.get<ApiResponse<BudgetSummary>>(`/budgets/${id}/summary`);
    return response.data.data!;
  },

  async updateBudget(id: string, data: Partial<CreateBudgetData>): Promise<Budget> {
    const response = await api.patch<ApiResponse<Budget>>(`/budgets/${id}`, data);
    return response.data.data!;
  },

  async archiveBudget(id: string): Promise<Budget> {
    const response = await api.post<ApiResponse<Budget>>(`/budgets/${id}/archive`);
    return response.data.data!;
  },

  async duplicateBudget(id: string, month: number, year: number): Promise<Budget> {
    const response = await api.post<ApiResponse<Budget>>(`/budgets/${id}/duplicate`, {
      month,
      year,
    });
    return response.data.data!;
  },

  async deleteBudget(id: string): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },
};
