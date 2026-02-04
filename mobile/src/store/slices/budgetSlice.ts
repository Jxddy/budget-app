import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { budgetService } from '../../services/budgetService';

interface BudgetState {
  budgets: any[];
  activeBudget: any | null;
  budgetSummary: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  activeBudget: null,
  budgetSummary: null,
  loading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  'budget/fetchBudgets',
  async (params?: { page?: number; limit?: number }) => {
    const response = await budgetService.getBudgets(params);
    return response;
  }
);

export const fetchActiveBudget = createAsyncThunk(
  'budget/fetchActiveBudget',
  async () => {
    const response = await budgetService.getActiveBudget();
    return response;
  }
);

export const fetchBudgetSummary = createAsyncThunk(
  'budget/fetchBudgetSummary',
  async (budgetId: string) => {
    const response = await budgetService.getBudgetSummary(budgetId);
    return response;
  }
);

export const createBudget = createAsyncThunk(
  'budget/createBudget',
  async (data: any) => {
    const response = await budgetService.createBudget(data);
    return response;
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload.budgets;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch budgets';
      })
      .addCase(fetchActiveBudget.fulfilled, (state, action) => {
        state.activeBudget = action.payload;
      })
      .addCase(fetchBudgetSummary.fulfilled, (state, action) => {
        state.budgetSummary = action.payload;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.budgets.unshift(action.payload);
      });
  },
});

export const { clearError } = budgetSlice.actions;
export default budgetSlice.reducer;
