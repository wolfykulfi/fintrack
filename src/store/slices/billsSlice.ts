import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Bill, Transaction } from '../../types';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { predictRecurringBills } from '../../services/aiService';

interface BillsState {
  bills: Bill[];
  loading: boolean;
  error: string | null;
}

const initialState: BillsState = {
  bills: [],
  loading: false,
  error: null,
};

export const fetchBills = createAsyncThunk(
  'bills/fetchBills',
  async (userId: string, { rejectWithValue }) => {
    try {
      const q = query(collection(db, 'bills'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const bills: Bill[] = [];
      querySnapshot.forEach((doc) => {
        bills.push({ id: doc.id, ...doc.data() } as Bill);
      });
      
      return bills;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBill = createAsyncThunk(
  'bills/addBill',
  async (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const now = Timestamp.now().toDate().toISOString();
      const docRef = await addDoc(collection(db, 'bills'), {
        ...bill,
        createdAt: now,
        updatedAt: now
      });
      
      return {
        id: docRef.id,
        ...bill,
        createdAt: now,
        updatedAt: now
      } as Bill;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBill = createAsyncThunk(
  'bills/updateBill',
  async ({ id, data }: { id: string; data: Partial<Bill> }, { rejectWithValue }) => {
    try {
      const billRef = doc(db, 'bills', id);
      const now = Timestamp.now().toDate().toISOString();
      
      await updateDoc(billRef, {
        ...data,
        updatedAt: now
      });
      
      return { id, ...data, updatedAt: now };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBill = createAsyncThunk(
  'bills/deleteBill',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'bills', id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const detectRecurringBills = createAsyncThunk(
  'bills/detectRecurringBills',
  async ({ transactions, userId }: { transactions: Transaction[]; userId: string }, { rejectWithValue }) => {
    try {
      const predictedBills = await predictRecurringBills(transactions);
      
      // Add each predicted bill to Firestore
      const addedBills: Bill[] = [];
      
      for (const bill of predictedBills) {
        const now = Timestamp.now().toDate().toISOString();
        const fullBill = {
          userId,
          name: bill.name as string,
          amount: bill.amount as number,
          dueDate: bill.dueDate as string,
          category: bill.category as string,
          isRecurring: bill.isRecurring as boolean,
          recurringFrequency: bill.recurringFrequency,
          isPaid: false,
          createdAt: now,
          updatedAt: now
        };
        
        const docRef = await addDoc(collection(db, 'bills'), fullBill);
        addedBills.push({ id: docRef.id, ...fullBill } as Bill);
      }
      
      return addedBills;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const billsSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    clearBillsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Bills
    builder.addCase(fetchBills.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBills.fulfilled, (state, action) => {
      state.loading = false;
      state.bills = action.payload;
    });
    builder.addCase(fetchBills.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add Bill
    builder.addCase(addBill.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addBill.fulfilled, (state, action) => {
      state.loading = false;
      state.bills.push(action.payload);
    });
    builder.addCase(addBill.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Bill
    builder.addCase(updateBill.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateBill.fulfilled, (state, action) => {
      state.loading = false;
      const { id } = action.payload;
      const index = state.bills.findIndex(b => b.id === id);
      if (index !== -1) {
        state.bills[index] = { ...state.bills[index], ...action.payload };
      }
    });
    builder.addCase(updateBill.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Bill
    builder.addCase(deleteBill.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteBill.fulfilled, (state, action) => {
      state.loading = false;
      state.bills = state.bills.filter(b => b.id !== action.payload);
    });
    builder.addCase(deleteBill.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Detect Recurring Bills
    builder.addCase(detectRecurringBills.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(detectRecurringBills.fulfilled, (state, action) => {
      state.loading = false;
      state.bills = [...state.bills, ...action.payload];
    });
    builder.addCase(detectRecurringBills.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearBillsError } = billsSlice.actions;
export default billsSlice.reducer; 