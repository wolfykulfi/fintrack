export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface BillReminder {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  isPaid: boolean;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export interface FinancialInsight {
  id: string;
  userId: string;
  type: 'spending' | 'saving' | 'investment' | 'fraud';
  title: string;
  description: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
}

export interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
}

export interface BudgetRecommendation {
  categoryId: string;
  category: string;
  recommendedAmount: number;
  currentAmount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  reasoning: string;
}

export interface Bill {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  isPaid: boolean;
  reminderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeState {
  isDarkMode: boolean;
}

export interface RootState {
  auth: {
    user: User | null;
    loading: boolean;
    error: string | null;
  };
  transactions: {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
  };
  budgets: {
    budgets: Budget[];
    recommendations: BudgetRecommendation[];
    loading: boolean;
    error: string | null;
  };
  bills: {
    bills: Bill[];
    loading: boolean;
    error: string | null;
  };
  insights: {
    insights: FinancialInsight[];
    loading: boolean;
    error: string | null;
  };
  theme: ThemeState;
} 