import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  transactionService,
  Transaction,
  CreateTransactionData,
  TransactionFilters,
  TransactionStats,
} from '../../services/transaction.service';
import { getErrorMessage, PaginatedResponse } from '../../services/api';

interface TransactionState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  stats: TransactionStats | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: TransactionFilters;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  currentTransaction: null,
  stats: null,
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  loading: false,
  error: null,
};

// Async thunks
export const createTransaction = createAsyncThunk(
  'transaction/createTransaction',
  async (data: CreateTransactionData, { rejectWithValue }) => {
    try {
      return await transactionService.createTransaction(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async (
    { filters, page, pageSize }: { filters?: TransactionFilters; page?: number; pageSize?: number },
    { rejectWithValue }
  ) => {
    try {
      return await transactionService.getTransactions(filters, page, pageSize);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchTransactionStats = createAsyncThunk(
  'transaction/fetchTransactionStats',
  async ({ startDate, endDate }: { startDate?: string; endDate?: string }, { rejectWithValue }) => {
    try {
      return await transactionService.getTransactionStats(startDate, endDate);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transaction/updateTransaction',
  async (
    { id, data }: { id: string; data: Partial<CreateTransactionData> },
    { rejectWithValue }
  ) => {
    try {
      return await transactionService.updateTransaction(id, data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transaction/deleteTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      await transactionService.deleteTransaction(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Transaction
    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Transaction Stats
    builder
      .addCase(fetchTransactionStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactionStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchTransactionStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Transaction
    builder
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      });

    // Delete Transaction
    builder
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setFilters, clearFilters, clearError } = transactionSlice.actions;
export default transactionSlice.reducer;
