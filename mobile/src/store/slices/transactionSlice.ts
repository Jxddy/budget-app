import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { transactionService } from '../../services/transactionService';

interface TransactionState {
  transactions: any[];
  statistics: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  statistics: null,
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async (params?: any) => {
    const response = await transactionService.getTransactions(params);
    return response;
  }
);

export const createTransaction = createAsyncThunk(
  'transaction/createTransaction',
  async (data: any) => {
    const response = await transactionService.createTransaction(data);
    return response;
  }
);

export const fetchStatistics = createAsyncThunk(
  'transaction/fetchStatistics',
  async (budgetId: string) => {
    const response = await transactionService.getStatistics(budgetId);
    return response;
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      });
  },
});

export const { clearError } = transactionSlice.actions;
export default transactionSlice.reducer;
