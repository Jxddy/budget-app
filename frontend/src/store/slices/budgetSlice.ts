import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { budgetService, Budget, BudgetSummary, CreateBudgetData } from '../../services/budget.service';
import { getErrorMessage } from '../../services/api';

interface BudgetState {
  budgets: Budget[];
  activeBudget: BudgetSummary | null;
  currentBudget: Budget | null;
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  activeBudget: null,
  currentBudget: null,
  loading: false,
  error: null,
};

// Async thunks
export const createBudget = createAsyncThunk(
  'budget/createBudget',
  async (data: CreateBudgetData, { rejectWithValue }) => {
    try {
      return await budgetService.createBudget(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchBudgets = createAsyncThunk(
  'budget/fetchBudgets',
  async (includeArchived: boolean = false, { rejectWithValue }) => {
    try {
      return await budgetService.getBudgets(includeArchived);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchActiveBudget = createAsyncThunk(
  'budget/fetchActiveBudget',
  async (_, { rejectWithValue }) => {
    try {
      return await budgetService.getActiveBudget();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchBudgetSummary = createAsyncThunk(
  'budget/fetchBudgetSummary',
  async (id: string, { rejectWithValue }) => {
    try {
      return await budgetService.getBudgetSummary(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budget/updateBudget',
  async ({ id, data }: { id: string; data: Partial<CreateBudgetData> }, { rejectWithValue }) => {
    try {
      return await budgetService.updateBudget(id, data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const duplicateBudget = createAsyncThunk(
  'budget/duplicateBudget',
  async ({ id, month, year }: { id: string; month: number; year: number }, { rejectWithValue }) => {
    try {
      return await budgetService.duplicateBudget(id, month, year);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budget/deleteBudget',
  async (id: string, { rejectWithValue }) => {
    try {
      await budgetService.deleteBudget(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBudget: (state) => {
      state.currentBudget = null;
    },
  },
  extraReducers: (builder) => {
    // Create Budget
    builder
      .addCase(createBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets.unshift(action.payload);
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Budgets
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Active Budget
    builder
      .addCase(fetchActiveBudget.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActiveBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.activeBudget = action.payload;
      })
      .addCase(fetchActiveBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Budget Summary
    builder
      .addCase(fetchBudgetSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBudgetSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.activeBudget = action.payload;
      })
      .addCase(fetchBudgetSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Budget
    builder
      .addCase(updateBudget.fulfilled, (state, action) => {
        const index = state.budgets.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      });

    // Duplicate Budget
    builder
      .addCase(duplicateBudget.fulfilled, (state, action) => {
        state.budgets.unshift(action.payload);
      });

    // Delete Budget
    builder
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter((b) => b.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
