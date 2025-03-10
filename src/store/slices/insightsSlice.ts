import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FinancialInsight, Transaction, Budget } from '../../types';
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { generateFinancialInsights, detectFraudulentTransactions } from '../../services/aiService';

interface InsightsState {
  insights: FinancialInsight[];
  loading: boolean;
  error: string | null;
}

const initialState: InsightsState = {
  insights: [],
  loading: false,
  error: null,
};

export const fetchInsights = createAsyncThunk(
  'insights/fetchInsights',
  async (userId: string, { rejectWithValue }) => {
    try {
      const q = query(collection(db, 'insights'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const insights: FinancialInsight[] = [];
      querySnapshot.forEach((doc) => {
        insights.push({ id: doc.id, ...doc.data() } as FinancialInsight);
      });
      
      return insights;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateInsights = createAsyncThunk(
  'insights/generateInsights',
  async (
    { 
      transactions, 
      budgets, 
      userId 
    }: { 
      transactions: Transaction[]; 
      budgets: Budget[]; 
      userId: string 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const generatedInsights = await generateFinancialInsights(transactions, budgets);
      
      // Add each insight to Firestore
      const addedInsights: FinancialInsight[] = [];
      
      for (const insight of generatedInsights) {
        const insightWithUserId = {
          ...insight,
          userId
        };
        
        const docRef = await addDoc(collection(db, 'insights'), insightWithUserId);
        addedInsights.push({ id: docRef.id, ...insightWithUserId } as FinancialInsight);
      }
      
      return addedInsights;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkFraudulentTransaction = createAsyncThunk(
  'insights/checkFraudulentTransaction',
  async (
    { 
      transactions, 
      newTransaction, 
      userId 
    }: { 
      transactions: Transaction[]; 
      newTransaction: Transaction; 
      userId: string 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const fraudResult = await detectFraudulentTransactions(transactions, newTransaction);
      
      // If potentially fraudulent, create an insight
      if (fraudResult.isFraudulent && fraudResult.confidence > 0.6) {
        const now = new Date().toISOString();
        const fraudInsight: FinancialInsight = {
          id: `fraud-${now}`,
          userId,
          type: 'fraud',
          title: 'Potential Fraudulent Transaction Detected',
          description: `We detected a potentially fraudulent transaction: "${newTransaction.description}" for $${newTransaction.amount}. ${fraudResult.reasoning}`,
          relatedTransactionIds: [newTransaction.id],
          createdAt: now
        };
        
        const docRef = await addDoc(collection(db, 'insights'), fraudInsight);
        return { id: docRef.id, ...fraudInsight } as FinancialInsight;
      }
      
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInsight = createAsyncThunk(
  'insights/deleteInsight',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'insights', id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    clearInsightsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Insights
    builder.addCase(fetchInsights.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchInsights.fulfilled, (state, action) => {
      state.loading = false;
      state.insights = action.payload;
    });
    builder.addCase(fetchInsights.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Generate Insights
    builder.addCase(generateInsights.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(generateInsights.fulfilled, (state, action) => {
      state.loading = false;
      state.insights = [...state.insights, ...action.payload];
    });
    builder.addCase(generateInsights.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Check Fraudulent Transaction
    builder.addCase(checkFraudulentTransaction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkFraudulentTransaction.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.insights.push(action.payload);
      }
    });
    builder.addCase(checkFraudulentTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Insight
    builder.addCase(deleteInsight.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteInsight.fulfilled, (state, action) => {
      state.loading = false;
      state.insights = state.insights.filter(i => i.id !== action.payload);
    });
    builder.addCase(deleteInsight.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearInsightsError } = insightsSlice.actions;
export default insightsSlice.reducer; 