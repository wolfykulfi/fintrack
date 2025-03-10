import { Transaction, Budget, BudgetRecommendation } from '../types';

// This is a mock implementation of the Gemini API service
// In a real application, you would integrate with the actual Gemini API

export const categorizeTransaction = async (
  description: string,
  amount: number
): Promise<{ category: string; confidence: number }> => {
  // Mock implementation - in a real app, this would call the Gemini API
  console.log(`Categorizing transaction: ${description}, $${amount}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simple keyword-based categorization for demonstration
  const keywords: Record<string, string[]> = {
    'Food': ['grocery', 'restaurant', 'food', 'meal', 'dinner', 'lunch', 'breakfast', 'cafe', 'coffee'],
    'Transport': ['uber', 'lyft', 'taxi', 'bus', 'train', 'subway', 'gas', 'fuel', 'parking'],
    'Entertainment': ['movie', 'netflix', 'spotify', 'hulu', 'disney', 'cinema', 'theater', 'concert'],
    'Shopping': ['amazon', 'walmart', 'target', 'store', 'mall', 'clothes', 'shoes', 'purchase'],
    'Utilities': ['electric', 'water', 'gas', 'internet', 'phone', 'bill', 'utility'],
    'Housing': ['rent', 'mortgage', 'apartment', 'house', 'insurance'],
    'Health': ['doctor', 'hospital', 'medical', 'pharmacy', 'medicine', 'health', 'dental'],
    'Education': ['school', 'college', 'university', 'tuition', 'book', 'course', 'class'],
    'Income': ['salary', 'paycheck', 'deposit', 'refund', 'reimbursement', 'payment'],
  };
  
  const lowerDesc = description.toLowerCase();
  
  for (const [category, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (lowerDesc.includes(word)) {
        return { 
          category, 
          confidence: 0.8 + Math.random() * 0.2 // Random confidence between 0.8 and 1.0
        };
      }
    }
  }
  
  // Default category if no match found
  return { category: 'Miscellaneous', confidence: 0.6 };
};

export const detectFraud = async (
  transaction: Transaction,
  previousTransactions: Transaction[]
): Promise<{ isFraudulent: boolean; confidence: number; reason?: string }> => {
  // Mock implementation - in a real app, this would call the Gemini API
  console.log(`Detecting fraud for transaction: ${transaction.description}, $${transaction.amount}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Simple fraud detection logic for demonstration
  const isUnusualAmount = transaction.amount > 1000; // Large amount
  const isUnusualLocation = transaction.description.toLowerCase().includes('unknown');
  const isDuplicate = previousTransactions.some(
    t => 
      t.id !== transaction.id && 
      t.amount === transaction.amount && 
      t.description === transaction.description &&
      new Date(t.date).getTime() > new Date().getTime() - 24 * 60 * 60 * 1000 // Within last 24 hours
  );
  
  if (isUnusualAmount && isUnusualLocation) {
    return { 
      isFraudulent: true, 
      confidence: 0.85,
      reason: 'Unusually large amount at an unknown merchant'
    };
  }
  
  if (isDuplicate) {
    return { 
      isFraudulent: true, 
      confidence: 0.9,
      reason: 'Duplicate transaction within 24 hours'
    };
  }
  
  return { isFraudulent: false, confidence: 0.95 };
};

export const generateBudgetRecommendations = async (
  transactions: Transaction[],
  currentBudgets: Budget[]
): Promise<BudgetRecommendation[]> => {
  // Mock implementation - in a real app, this would call the Gemini API
  console.log('Generating budget recommendations');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const recommendations: BudgetRecommendation[] = [];
  
  // Group transactions by category
  const categorySpending: Record<string, number> = {};
  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      if (!categorySpending[transaction.category]) {
        categorySpending[transaction.category] = 0;
      }
      categorySpending[transaction.category] += transaction.amount;
    }
  });
  
  // Generate recommendations based on spending patterns
  currentBudgets.forEach(budget => {
    const spending = categorySpending[budget.category] || 0;
    
    // If spending is consistently under budget, recommend reducing the budget
    if (spending < budget.limit * 0.7) {
      recommendations.push({
        categoryId: budget.id,
        category: budget.category,
        recommendedAmount: Math.round(spending * 1.2), // 20% buffer
        currentAmount: budget.limit,
        period: budget.period,
        reasoning: `Your spending in ${budget.category} is consistently under budget. You could reduce this budget by ${(budget.limit - Math.round(spending * 1.2)).toFixed(2)}.`
      });
    }
    
    // If spending is consistently over budget, recommend increasing the budget
    if (spending > budget.limit * 1.1) {
      recommendations.push({
        categoryId: budget.id,
        category: budget.category,
        recommendedAmount: Math.round(spending * 1.1), // 10% buffer
        currentAmount: budget.limit,
        period: budget.period,
        reasoning: `Your spending in ${budget.category} consistently exceeds your budget. Consider increasing it by ${(Math.round(spending * 1.1) - budget.limit).toFixed(2)}.`
      });
    }
  });
  
  return recommendations;
};

export const analyzeBankStatement = async (
  statementText: string
): Promise<Transaction[]> => {
  // Mock implementation - in a real app, this would call the Gemini API
  console.log('Analyzing bank statement');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // This is a simplified mock that would normally use Gemini to extract transactions
  // from the bank statement text
  const mockTransactions: Transaction[] = [
    {
      id: `auto-${Date.now()}-1`,
      userId: 'current-user',
      amount: 45.99,
      category: 'Food',
      description: 'GROCERY STORE',
      date: new Date().toISOString(),
      type: 'expense',
      isRecurring: false,
    },
    {
      id: `auto-${Date.now()}-2`,
      userId: 'current-user',
      amount: 9.99,
      category: 'Entertainment',
      description: 'NETFLIX SUBSCRIPTION',
      date: new Date().toISOString(),
      type: 'expense',
      isRecurring: true,
      recurringFrequency: 'monthly',
    },
    {
      id: `auto-${Date.now()}-3`,
      userId: 'current-user',
      amount: 2500,
      category: 'Income',
      description: 'SALARY DEPOSIT',
      date: new Date().toISOString(),
      type: 'income',
      isRecurring: true,
      recurringFrequency: 'monthly',
    },
  ];
  
  return mockTransactions;
};

export const generateFinancialInsights = async (
  transactions: Transaction[],
  budgets: Budget[]
): Promise<string[]> => {
  // Mock implementation - in a real app, this would call the Gemini API
  console.log('Generating financial insights');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simple insights generation for demonstration
  const insights: string[] = [];
  
  // Calculate total income and expenses
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Savings rate insight
  const savingsRate = (totalIncome - totalExpenses) / totalIncome;
  if (savingsRate < 0.1) {
    insights.push('Your savings rate is below 10%. Consider reducing non-essential expenses to increase your savings.');
  } else if (savingsRate > 0.3) {
    insights.push('Great job! Your savings rate is above 30%. You might consider investing some of your savings for long-term growth.');
  }
  
  // Recurring subscriptions insight
  const subscriptions = transactions.filter(t => 
    t.type === 'expense' && 
    t.isRecurring && 
    t.recurringFrequency === 'monthly' &&
    t.amount < 50 // Typical subscription price range
  );
  
  if (subscriptions.length > 3) {
    const totalSubscriptionCost = subscriptions.reduce((sum, t) => sum + t.amount, 0);
    insights.push(`You have ${subscriptions.length} active subscriptions totaling $${totalSubscriptionCost.toFixed(2)} monthly. Consider reviewing if you need all of them.`);
  }
  
  // Budget insights
  budgets.forEach(budget => {
    if (budget.spent > budget.limit) {
      insights.push(`You've exceeded your ${budget.category} budget by $${(budget.spent - budget.limit).toFixed(2)}. Try to reduce spending in this category.`);
    } else if (budget.spent > budget.limit * 0.9) {
      insights.push(`You're close to exceeding your ${budget.category} budget. You have $${(budget.limit - budget.spent).toFixed(2)} left.`);
    }
  });
  
  return insights;
}; 