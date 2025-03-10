import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Budget, BudgetRecommendation, Transaction } from '../../types';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { generateBudgetRecommendations } from '../../services/aiService';

interface BudgetsState {
  budgets: Budget[];
  recommendations: BudgetRecommendation[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetsState = {
  budgets: [],
  recommendations: [],
  loading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async (userId: string, { rejectWithValue }) => {
    try {
      const q = query(collection(db, 'budgets'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const budgets: Budget[] = [];
      querySnapshot.forEach((doc) => {
        budgets.push({ id: doc.id, ...doc.data() } as Budget);
      });
      
      return budgets;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBudget = createAsyncThunk(
  'budgets/addBudget',
  async (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const now = Timestamp.now().toDate().toISOString();
      const docRef = await addDoc(collection(db, 'budgets'), {
        ...budget,
        createdAt: now,
        updatedAt: now
      });
      
      return {
        id: docRef.id,
        ...budget,
        createdAt: now,
        updatedAt: now
      } as Budget;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async ({ id, data }: { id: string; data: Partial<Budget> }, { rejectWithValue }) => {
    try {
      const budgetRef = doc(db, 'budgets', id);
      const now = Timestamp.now().toDate().toISOString();
      
      await updateDoc(budgetRef, {
        ...data,
        updatedAt: now
      });
      
      return { id, ...data, updatedAt: now };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'budgets', id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBudgetRecommendations = createAsyncThunk(
  'budgets/getBudgetRecommendations',
  async (
    { transactions, currentBudgets }: { transactions: Transaction[]; currentBudgets: Budget[] },
    { rejectWithValue }
  ) => {
    try {
      const recommendations = await generateBudgetRecommendations(transactions, currentBudgets);
      return recommendations;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    clearBudgetsError: (state) => {
      state.error = null;
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Budgets
    builder.addCase(fetchBudgets.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBudgets.fulfilled, (state, action) => {
      state.loading = false;
      state.budgets = action.payload;
    });
    builder.addCase(fetchBudgets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add Budget
    builder.addCase(addBudget.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addBudget.fulfilled, (state, action) => {
      state.loading = false;
      state.budgets.push(action.payload);
    });
    builder.addCase(addBudget.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Budget
    builder.addCase(updateBudget.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateBudget.fulfilled, (state, action) => {
      state.loading = false;
      const { id } = action.payload;
      const index = state.budgets.findIndex(b => b.id === id);
      if (index !== -1) {
        state.budgets[index] = { ...state.budgets[index], ...action.payload };
      }
    });
    builder.addCase(updateBudget.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Budget
    builder.addCase(deleteBudget.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteBudget.fulfilled, (state, action) => {
      state.loading = false;
      state.budgets = state.budgets.filter(b => b.id !== action.payload);
    });
    builder.addCase(deleteBudget.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get Budget Recommendations
    builder.addCase(getBudgetRecommendations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getBudgetRecommendations.fulfilled, (state, action) => {
      state.loading = false;
      state.recommendations = action.payload;
    });
    builder.addCase(getBudgetRecommendations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearBudgetsError, clearRecommendations } = budgetsSlice.actions;
export default budgetsSlice.reducer; 