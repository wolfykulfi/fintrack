import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types';
import { 
  addTransaction as addTransactionToFirestore,
  getTransactions as getTransactionsFromFirestore,
  updateTransaction as updateTransactionInFirestore,
  deleteTransaction as deleteTransactionFromFirestore,
  uploadTransactionAttachment
} from '../../services/firebase';
import { categorizeTransaction, analyzeBankStatement } from '../../services/aiService';

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (userId: string, { rejectWithValue }) => {
    try {
      const transactions = await getTransactionsFromFirestore(userId);
      return transactions;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (
    { 
      transaction, 
      attachment 
    }: { 
      transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'category'> & { category?: string }; 
      attachment?: Blob 
    }, 
    { rejectWithValue }
  ) => {
    try {
      // If category is not provided, use AI to categorize
      let category = transaction.category;
      if (!category) {
        category = await categorizeTransaction(transaction.description, transaction.amount);
      }

      // Create transaction object
      const transactionWithCategory = {
        ...transaction,
        category
      };

      // Upload attachment if provided
      let attachmentUrl;
      if (attachment) {
        const newTransaction = await addTransactionToFirestore(transactionWithCategory);
        attachmentUrl = await uploadTransactionAttachment(
          attachment, 
          transaction.userId, 
          newTransaction.id
        );
        
        // Update transaction with attachment URL
        await updateTransactionInFirestore(newTransaction.id, { attachmentUrl });
        return { ...newTransaction, attachmentUrl };
      }

      // Add transaction without attachment
      const newTransaction = await addTransactionToFirestore(transactionWithCategory);
      return newTransaction;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (
    { 
      id, 
      data, 
      attachment 
    }: { 
      id: string; 
      data: Partial<Transaction>; 
      attachment?: Blob 
    }, 
    { rejectWithValue }
  ) => {
    try {
      // Upload attachment if provided
      if (attachment) {
        const attachmentUrl = await uploadTransactionAttachment(
          attachment, 
          data.userId as string, 
          id
        );
        data.attachmentUrl = attachmentUrl;
      }

      await updateTransactionInFirestore(id, data);
      return { id, ...data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTransactionFromFirestore(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const processBankStatement = createAsyncThunk(
  'transactions/processBankStatement',
  async (
    { 
      statementText, 
      userId 
    }: { 
      statementText: string; 
      userId: string 
    }, 
    { rejectWithValue }
  ) => {
    try {
      // Extract transactions from bank statement
      const extractedTransactions = await analyzeBankStatement(statementText);
      
      // Add each transaction to Firestore
      const addedTransactions: Transaction[] = [];
      
      for (const transaction of extractedTransactions) {
        // Get category using AI
        const category = await categorizeTransaction(
          transaction.description as string, 
          transaction.amount as number
        );
        
        // Create full transaction object
        const fullTransaction = {
          userId,
          description: transaction.description as string,
          amount: transaction.amount as number,
          date: transaction.date as string,
          isExpense: transaction.isExpense as boolean,
          category,
          isRecurring: false,
        };
        
        // Add to Firestore
        const newTransaction = await addTransactionToFirestore(fullTransaction);
        addedTransactions.push(newTransaction);
      }
      
      return addedTransactions;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactionsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Transactions
    builder.addCase(fetchTransactions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.transactions = action.payload;
    });
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add Transaction
    builder.addCase(addTransaction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addTransaction.fulfilled, (state, action) => {
      state.loading = false;
      state.transactions.push(action.payload);
    });
    builder.addCase(addTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Transaction
    builder.addCase(updateTransaction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateTransaction.fulfilled, (state, action) => {
      state.loading = false;
      const { id } = action.payload;
      const index = state.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        state.transactions[index] = { ...state.transactions[index], ...action.payload };
      }
    });
    builder.addCase(updateTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Transaction
    builder.addCase(deleteTransaction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteTransaction.fulfilled, (state, action) => {
      state.loading = false;
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
    });
    builder.addCase(deleteTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Process Bank Statement
    builder.addCase(processBankStatement.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(processBankStatement.fulfilled, (state, action) => {
      state.loading = false;
      state.transactions = [...state.transactions, ...action.payload];
    });
    builder.addCase(processBankStatement.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearTransactionsError } = transactionsSlice.actions;
export default transactionsSlice.reducer; 